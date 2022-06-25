using FreeImages.Data;
using FreeImages.Intefaces;
using FreeImages.Models;
using FreeImages.Repository;
using FreeImages.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FreeImages.Controllers;

[Route("[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly IHelpFunctions _help;
    private readonly IConfiguration _config;
    private readonly ILogger<AccountController> _logger;
    private readonly SignInManager<User> _signInManager;
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly MailRepository _mail;
    private readonly FreeImagesDbConnect _db;

    public AccountController(
        IHelpFunctions help,
        IConfiguration config,
                    UserManager<User> userManager,
            SignInManager<User> signInManager,
            ILogger<AccountController> logger,
            RoleManager<IdentityRole> roleManager,
            FreeImagesDbConnect db
        )
    {
        _help = help;
        _config = config;
        _userManager = userManager;
        _logger = logger;
        _signInManager = signInManager;
        _roleManager = roleManager;
        _mail = new MailRepository();
        _db = db;
    }

    #region GET
    [HttpGet("Logout")] // Logg out
    public async Task<IActionResult> LogOut()
    {
        try
        {
            await _signInManager.SignOutAsync();
            _logger.LogInformation("Users are logged out.");
            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(new { alert = "error", message = "Something has gone wrong.", erorrmMessage = "Error => " + e.Message });
        }
    }

    [HttpGet("LoginLink/{email}")] // Send authantication link
    public async Task<IActionResult> LoginLink(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return BadRequest(new { alert = "error", message = "Users with matching email address not found ... " });

        if (!_help.CheckEmail(email))
            return BadRequest(new { alert = "error", message = "Incorrect email address" });

        user.LoginHash = Guid.NewGuid();

        if (_help.Save())
        {
            var mailContent = "<h4>Hi " + user.Name + "!</h4>" +
                       "<p>Here is the login link to log in to {domain}.</p>" +
                       "<p>Click <a href='{domain}/login/" + user.LoginHash + "' target='_blank'>here</a> to login.</p>";

            if (!_mail.SendMail(email, "Login link", mailContent))
                return BadRequest(new { alert = "error", message = "Something went wrong trying to send an email, please try again later ..." });

            return Ok(new { alert = "success", message = "It went well without any problems! <br/> Please check your email!" });
        }

        return BadRequest(new { alert = "error", message = "Something went wrong ...." });
    }

    [HttpGet("LoginWithoutPassword/{hash}")] // Login without password
    public async Task<IActionResult> SignInWidthoutPassword(string hash)
    {
        var user = _db.User?.FirstOrDefault(x => x.LoginHash.ToString() == hash.ToString());

        if (hash == null || user == null)
            return BadRequest(new { alert = "error", message = "Something has gone wrong. There is no or no valid login link for users." });

        try
        {
            var roles = _userManager.GetRolesAsync(user).Result;

            user.LoginHash = Guid.Empty;
            _help.Save();

            var token = GenerateJwtToken(user, roles.ToList(), 1);
            await _signInManager.SignInAsync(user, true, null);
            return Ok(new { alert = "success", token = token, user = user.Name, id = user.Id });
        }
        catch (Exception e)
        {
            return BadRequest(new { alert = "error", message = "Something has gone wrong.", errorMessage = "Server error => " + e.Message });
        }
    }
    [HttpGet("ChangePassword")] // Send new password
    [Authorize]
    public async Task<IActionResult> ForgotPassword(string email)
    {
        if (!_help.CheckEmail(email))
            return BadRequest("Incorrect email address");

        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return BadRequest("Users with matching emails have not been found ...");

        var newPassword = _help.Hash(10);
        var remove = await _userManager.RemovePasswordAsync(user);
        if (remove.Succeeded)
        {
            // If old pass removed, insert new pass
            var password = await _userManager.AddPasswordAsync(user, newPassword);
            if (password.Succeeded)
            {
                var mailContent = "<h4>Hi " + user.Name + "</h4><br/>" +
                              "<p>Your password has been changed.</p>" +
                              "<p>Your new password is: <span style='font-weight:bold;margin-lleft:15px'>" + newPassword + "</span></p><br/>";

                // Mails
                //_help.SendMail(user.Email, "Nytt lösenord", mailContent);
                return Ok(new { alert = "success", message = "The new password has been sent, check your email" });
            }
        }
        return BadRequest(new { alert = "error", message = "Failed to save new password, please try again later ..." });
    }
    #endregion

    #region Post
    [HttpPost("Register")] // Register
    //[Authorize(Roles = "Admin, Support")]
    public async Task<IActionResult> Register(AccountViewModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest();
        if (!_help.CheckEmail(model.Email))
            return BadRequest(new { alert = "warning", message = "Incorrect email address" });

        var admin_email = model.Email.Equals("aslan_argun@hotmail.com") || model.Email.Equals("janeta_88@hotmail.com");
        var user = new User { Name = model.Name, UserName = model.Email, Email = model.Email };
        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded)
        {
            List<string> roles = model.Roles.ToList();

            if (roles.IndexOf("User") == -1)
                roles.Add("User");
            if (admin_email)
            {
                if (roles.IndexOf("Admin") == -1)
                    roles.Add("Admin");
                if (roles.IndexOf("Support") == -1)
                    roles.Add("Support");
                if (roles.IndexOf("User") == -1)
                    roles.Add("User");
            }

            for (var i = 0; i < roles.Count(); i++)
            {
                var role = _roleManager.FindByNameAsync(roles[i]).Result;
                await _userManager.AddToRoleAsync(user, role.Name);
            }

            await _signInManager.SignInAsync(user, isPersistent: false);

            var token = GenerateJwtToken(user, roles);

            var mailContent = "<h4>Hi " + model.Name + "!</h4><br/>" +
                              "<p>Welcome as a new user on {domain}.</p>" +
                              "<p>Below are your login details, save them for future reference.</p><br/>" +
                              "<p>Username: " + model.Email + "</p>" +
                              "<p>Password: " + model.Password + "</p><br/>";

            // Mails
            //_help.SendMail(user.Email, "Välkommen " + model.Name, mailContent);

            return Ok(new { alert = "success", message = "Registration was successful!" });
        }

        var error_message = "";
        foreach (var error in result.Errors)
        {
            ModelState.AddModelError(string.Empty, error.Description);
            error_message += error.Description + "<br/>";
        }

        return BadRequest(new { alert = "error", message = error_message });
    }

    [HttpPost("Login")] // Logga in
    public async Task<IActionResult> SignIn(LoginViewModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { alert = "warning", message = "Form data is incorrectly filled in" });
        else if (!_help.CheckEmail(model.Email))
            return BadRequest(new { alert = "warning", message = "Incorrect email address" });

        // This doesn't count login failures towards account lockout
        // To enable password failures to trigger account lockout, set lockoutOnFailure: true
        var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.Remember, lockoutOnFailure: true);
        if (result.Succeeded)
        {
            var user = await _userManager.FindByNameAsync(model.Email);
            var currentRoles = _userManager.GetRolesAsync(user).Result;

            var days = (model.Remember) ? 30 : 1;
            var token = GenerateJwtToken(user, currentRoles.ToList(), days);
            return Ok(new { alert = "success", token = token, user = user.Name });
        }
        return BadRequest(new
        {
            alert = "error",
            message = (result.IsLockedOut) ? "User account locked out. Please try again later ..."
                : "Incorrect email address or password"
        });
    }
    #endregion

    #region Helpers
    // Create Jwt Token for authenticating
    private string GenerateJwtToken(User user, List<string> roles, int days = 1)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["FreeImagesJwt:Key"]));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
        IdentityOptions opt = new IdentityOptions();

        var claims = new List<Claim>();
        claims.Add(new Claim(ClaimTypes.Name, user.Name));
        claims.Add(new Claim("Email", user.Email));

        foreach (var r in roles)
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
