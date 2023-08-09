using FreeImages.Data;
using FreeImages.Intefaces;
using FreeImages.Models;
using FreeImages.Repository;
using FreeImages.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace FreeImages.Controllers;

[Route("[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly IHelpFunctions _help;
    private readonly IConfiguration _config;
    private readonly ILogger<AccountController> _logger;
    private readonly MailRepository _mail;
    private readonly DbConnect _db;
    private readonly HashAlgorithmName _hashAlgorithm;

    const int _iterations = 3500000;

    public AccountController(
            IHelpFunctions help,
            IConfiguration config,
            ILogger<AccountController> logger,
            DbConnect db
        )
    {
        _help = help;
        _config = config;
        _logger = logger;
        _mail = new MailRepository();
        _db = db;
        _hashAlgorithm = HashAlgorithmName.SHA512;
    }

    public IEnumerable<User> _users
    {
        get
        {
            return _db.Users?.ToList() ?? Enumerable.Empty<User>();
        }
    }

    #region GET
    [HttpGet("SendLoginLink/{email}")] // Send authantication link
    public async Task<JsonResult> LoginLink(string email)
    {
        User user = await _db.Users?.FirstOrDefaultAsync(x => x.Email == email);
        if (user == null)
            return _help.Response("error", "No users with matching email addresses found ... ");

        if (!_help.CheckEmail(email))
            return _help.Response("error", "Incorrect email address");

        user.LoginHash = Guid.NewGuid().ToString();
        user.LoginHashValidTime = DateTime.Now.AddHours(3);

        if (await _help.Save())
        {
            var mailContent = "<h4>Hi " + user.Name + "!</h4>" +
                       "<p>Here is the login link to sign in to {domain}.</p>" +
                       "<p>Click <a href='{domain}/login/" + user.LoginHash + "' target='_blank'>here</a> to login.</p>" +
                       $"<p>Note! This link is valid for only 3 hours and will be expired {user.LoginHashValidTime?.ToString("yyyy.MM.dd HH:mm:ss")}.</p>";

            if (!_mail.SendEmail(email, "Login link", mailContent))
                return _help.Response("error", "Something went wrong trying to send an email, please try again later ...");

            return _help.Response("success", "It went well without any problems! <br/> Please check your email!");
        }

        return _help.Response("error", "Something went wrong ....");
    }

    [HttpGet("LoginWithoutPassword/{hash}")] // Login without password
    public async Task<IActionResult> SignInWidthoutPassword(string? hash)
    {
        try
        {
            var user = await _db.Users?.FirstOrDefaultAsync(x => x.LoginHash == hash);

            if (hash == null || user == null)
                return _help.Response("error", "Ingen användare eller ingen giltig inloggningslänk hittades.");
            else if (user.LoginHashValidTime?.Ticks < DateTime.Now.Ticks)
                return _help.Response("error", "This link valid time already expired!");

            user.LoginHash = null;
            user.LoginHashValidTime = null;
            await _help.Save();

            var token = GenerateJwtToken(user, 5);
            return new JsonResult(new { token, user = user.Name, id = user.Id });
        }
        catch (Exception e)
        {
            return _help.Response("error", "Something has gone wrong. Error: " + e.Message);
        }
    }

    [HttpGet("Logout")] // Logg out
    [Authorize]
    public IActionResult LogOut()
    {
        try
        {
            var user = User as ClaimsPrincipal;
            var identity = user.Identity as ClaimsIdentity;
            var claims = User.Claims.ToList();
            foreach (var claim in claims)
                identity?.TryRemoveClaim(claim);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }

        _logger.LogInformation("Users are logged out.");
        return Ok();
    }
    #endregion

    #region POST
    [HttpPost("Register")] // Register
    public async Task<JsonResult> PostRegister(AccountViewModel model)
    {

        if (!ModelState.IsValid)
            return _help.Response("warning", "Incorrect form data!");
        else if (!_help.CheckEmail(model.Email))
            return _help.Response("warning", "Incorrect email address");
        else if (await _db.Users.FirstOrDefaultAsync(x => x.Email == model.Email) != null)
            return _help.Response("warning", "Users with the same email already exists!");

        var firstRegister = _users?.Count() == 0;

        // Check admin email
        var support = model.Email.Equals("aslan_argun@hotmail.com");
        if (!firstRegister && model.Email != "aslan_argun@hotmail.com" && model.Roles.IndexOf("Support") == -1 && !Permission("Admin"))
            return _help.Response("warning", "Permission is missing!");

        string errorMessage = String.Empty;
        try
        {
            // Hash password
            var salt = PasswordSalt(model.Email);
            var hashedPassword = HashPassword(model, salt);

            // Create roles
            var roles = model?.ListRoles;

            if (support || (roles?.Count == 0 && _users?.Count() == 0))
            {
                if (roles?.IndexOf("Admin") == -1)
                    roles.Add("Admin");
                if (roles?.IndexOf("Manager") == -1)
                    roles.Add("Manager");
                if (roles.IndexOf("Support") == -1 && support)
                    roles.Add("Support");
            }

            roles?.Add("User");
            // Create and save a user into the database
            var user = new User
            {
                Name = model?.Name,
                Email = model?.Email,
                Password = hashedPassword,
                PasswordVerificationCode = salt,
                Roles = roles?.Count > 0 ? string.Join(",", roles) : null
            };

            _db.Users?.Add(user);

            if (await _help.Save())
            {
                var mailContent = "<h4>Hi " + model?.Name + "!</h4><br/>" +
                                  "<p>Welcome as a new user on {domain}.</p>" +
                                  "<p>Below are your login details. Please, save them for future reference.</p><br/>" +
                                  "<p>Username: " + model?.Email + "</p>" +
                                  "<p>Password: " + model?.Password + "</p><br/>";

                // Send a mail to new user
                _mail.SendEmail(user?.Email, "Welcome " + model?.Name, mailContent);

                if (firstRegister)
                {
                    var token = GenerateJwtToken(user);
                    return new JsonResult(new { alert = "success", token });
                }
                else
                    return _help.Response("success");
            }
        }
        catch (Exception ex)
        {
            errorMessage = ex.Message;
        }

        return _help.Response("error", errorMessage);
    }

    [HttpPost("Login")] // Logga in
    public async Task<JsonResult> PostLogin(LoginViewModel model)
    {
        if (!ModelState.IsValid)
            return _help.Response("warning", "Form data is incorrectly filled in");
        else if (!_help.CheckEmail(model?.Email))
            return _help.Response("warning", "Incorrect email address");

        var errorMessage = String.Empty;
        try
        {
            var user = await _db.Users?.FirstOrDefaultAsync(x => x.Email == model.Email);
            if (user == null || !VerifyPassword(model?.Password, user))
                return _help.Response("warning", "Incorrect email address or password");
            else
            {
                var days = (model.Remember) ? 30 : 1;
                var token = GenerateJwtToken(user, days);
                return new JsonResult(new { alert = "success", token, user = user.Name });
            }
        }
        catch (Exception ex)
        {
            errorMessage = ex.Message;
        }

        return _help.Response("error", errorMessage);
    }
    #endregion

    #region PUT
    [HttpPut("ChangePassword/{id}")] // Send new password
    [Authorize]
    public async Task<IActionResult> ChangePassword(string id, AccountViewModel model)
    {

        var user = await _db.Users?.FirstOrDefaultAsync(x => x.Id == id);

        if (user == null)
            return _help.Response("error", "Users with matching emails have not been found ...");
        var email = user.Email;

        var currentEmail = GetClaim("Email");
        if (user.Email != currentEmail && !Permission("Admin") && !Permission("Support"))
            return _help.Response("error", "Permission denied!");
        if (!VerifyPassword(model?.CurrentPassword, user))
            return _help.Response("error", "Current password is wrong!");

        string errorMessage = "Failed to try to change password, please try again later ...";
        try
        {
            var newPassword = _help.Hash(10);

            // Hash password
            var salt = PasswordSalt(email);
            var hashedPassword = HashPassword(model, salt);

            user.Password = hashedPassword;
            user.PasswordVerificationCode = salt;

            if (!await _help.Save())
                return _help.Response("error");

            var mailContent = "<h4>Hi " + user.Name + "</h4><br/>" +
                          "<p>Your password has been changed by your self.</p>" +
                          "<p>Your new password is: <span style='font-weight:bold;margin-lleft:15px'>" + newPassword + "</span></p><br/>";

            // Mails
            _mail.SendEmail(user.Email, "New password", mailContent);
            return _help.Response("success", "The new password has been sent, check your email.");
        }
        catch (Exception ex)
        {
            errorMessage += $" Error: {ex.Message}";
        };


        return _help.Response("error", errorMessage);
    }

    [HttpPut("SetNewPassword/{key}")] // Send new password
    [Authorize(Roles = "Admin,Manager,Support")]
    public async Task<IActionResult> SetNewPassword(string key, User model)
    {
        var user = await _db.Users?.FirstOrDefaultAsync(x => x.Email == key || x.Id == key);
        if (user == null)
            return _help.Response("error", "Users with matching emails have not been found ...");

        var currentEmail = GetClaim("Email");
        if (user.Email != currentEmail)
        {
            if ((user.Roles?.IndexOf("Admin") > -1 && !Permission("Support")) || !Permission("Admin"))
                return _help.Response("error", "Permission denied!");
        }

        string errorMessage = "Failed to try to change password, please try again later ...";
        try
        {
            var newPassword = _help.Hash(10);
            var oldPassword = user.Password;
            var oldVerificationCode = user.PasswordVerificationCode;

            // Hash password
            var salt = PasswordSalt(user.Email);
            var hashedPassword = HashPassword(new AccountViewModel
            {
                Email = model?.Email,
                Password = newPassword
            }, salt);

            user.Password = hashedPassword;
            user.PasswordVerificationCode = salt;

            if (await _help.Save())
            {
                var mailContent = "<h4>Hi " + user.Name + "</h4><br/>" +
                              "<p>Your password has been changed.</p>" +
                              "<p>Your new password is: <span style='font-weight:bold;margin-lleft:15px'>" + newPassword + "</span></p><br/>";

                // Mails
                if (!_mail.SendEmail(user.Email, "New password", mailContent))
                {
                    user.Password = oldPassword;
                    user.PasswordVerificationCode = oldVerificationCode;
                    await _help.Save();
                    return _help.Response("success", "The new password has been sent, check your email");
                }
            }
        }
        catch (Exception ex)
        {
            errorMessage += $" Error: {ex.Message}";
        };

        return _help.Response("error", errorMessage);
    }
    #endregion

    #region Helpers
    // Get claims 
    private bool Permission(string role)
    {
        //var claims = Users.Claims.ToList();
        var claimRoles = User.Claims?.FirstOrDefault(x => x.Type == "Roles")?.ToString();
        return claimRoles?.IndexOf(role) > -1;
    }

    // Get claim type
    public string? GetClaim(string name) =>
        User.Claims?.FirstOrDefault(x => x.Type == name)?.Value?.ToString();

    // Hash password
    private string HashPassword(AccountViewModel model, byte[] salt)
    {
        //salt = RandomNumberGenerator.GetBytes(keySize);
        //salt = model.PasswordSalt;
        var keySize = model.Email.Length * 2;

        var hash = Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(model?.Password),
            salt,
            _iterations,
            _hashAlgorithm,
            keySize
        );

        return Convert.ToHexString(hash);
    }

    // Generate password verification code (salt)
    private static byte[] PasswordSalt(string email)
    {
        using RNGCryptoServiceProvider provider = new();
        byte[] salt = new byte[email.Length * 2];
        provider.GetBytes(salt);
        return salt;
    }

    // Verify password
    private bool VerifyPassword(string password, User model)
    {
        int keySize = (model.Email.Length * 2);
        var hashToCompare = Rfc2898DeriveBytes.Pbkdf2(password, model.PasswordVerificationCode, _iterations, _hashAlgorithm, keySize);
        return CryptographicOperations.FixedTimeEquals(hashToCompare, Convert.FromHexString(model.Password));
    }

    // Create Jwt Token for authenticating
    private string GenerateJwtToken(User user, int days = 1)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["FreeImagesJwt:Key"]));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
        IdentityOptions opt = new IdentityOptions();

        var claims = new List<Claim>();
        claims.Add(new Claim("Id", user.Id));
        claims.Add(new Claim("Name", user.Name));
        claims.Add(new Claim("Email", user.Email));
        claims.Add(new Claim("Roles", user.Roles.ToString()));

        foreach (var r in user.ListRoles)
            claims.Add(new Claim(opt.ClaimsIdentity.RoleClaimType, r));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims.ToArray()),
            Expires = DateTime.Now.AddDays(days),
            SigningCredentials = credentials
        };

        var encodeToken = new JwtSecurityTokenHandler();
        var securityToken = encodeToken.CreateToken(tokenDescriptor);
        var token = encodeToken.WriteToken(securityToken);

        return token;
    }
    #endregion
}
