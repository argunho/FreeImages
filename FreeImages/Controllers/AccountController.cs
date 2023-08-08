﻿using FreeImages.Data;
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
    [HttpGet("Logout")] // Logg out
    [Authorize]
    public IActionResult LogOut()
    {
        try
        {
            var user = User as ClaimsPrincipal;
            var identity = user.Identity as ClaimsIdentity;
            foreach (var claim in User.Claims.ToList())
                identity.TryRemoveClaim(claim);
        }catch(Exception ex){
            Console.WriteLine(ex.Message);
        }

        _logger.LogInformation("Users are logged out.");
        return Ok();
    }

    [HttpGet("LoginLink/{email}")] // Send authantication link
    public async Task<IActionResult> LoginLink(string email)
    {
        User user = null;
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
        var user = _db.Users?.FirstOrDefault(x => x.LoginHash.ToString() == hash.ToString());

        if (hash == null || user == null)
            return BadRequest(new { alert = "error", message = "Something has gone wrong. There is no or no valid login link for users." });

        try
        {
            //var roles = _userManager.GetRolesAsync(user).Result;

            user.LoginHash = Guid.Empty;
            _help.Save();

            //var token = GenerateJwtToken(user, roles.ToList(), 1);
            //await _signInManager.SignInAsync(user, true, null);
            //return Ok(new { alert = "success", token = token, user = user.Name, id = user.Id });
            return Ok();
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
        //if (!_help.CheckEmail(email))
        return BadRequest("Incorrect email address");

        ////var user = await _userManager.FindByEmailAsync(email);
        //if (user == null)
        //    return BadRequest("Users with matching emails have not been found ...");

        //var newPassword = _help.Hash(10);
        ////var remove = await _userManager.RemovePasswordAsync(user);
        //if (remove.Succeeded)
        //{
        //    // If old pass removed, insert new pass
        //    //var password = await _userManager.AddPasswordAsync(user, newPassword);
        //    if (password.Succeeded)
        //    {
        //        var mailContent = "<h4>Hi " + user.Name + "</h4><br/>" +
        //                      "<p>Your password has been changed.</p>" +
        //                      "<p>Your new password is: <span style='font-weight:bold;margin-lleft:15px'>" + newPassword + "</span></p><br/>";

        //        // Mails
        //        //_help.SendMail(user.Email, "Nytt lösenord", mailContent);
        //        return Ok(new { alert = "success", message = "The new password has been sent, check your email" });
        //    }
        //}
        //return BadRequest(new { alert = "error", message = "Failed to save new password, please try again later ..." });
    }
    #endregion

    #region Post
    [HttpPost("Register")] // Register
    public async Task<JsonResult> PostRegister(AccountViewModel model)
    {

        if (!ModelState.IsValid)
            return _help.Response("warning", "Incorrect form data!");
        else if (!_help.CheckEmail(model.Email))
            return _help.Response("warning", "Incorrect email address");
        else if (_users.FirstOrDefault(x => x.Email == model.Email) != null)
            return _help.Response("warning", "Users with the same email already exists!");

        var firstRegister = _users?.Count() == 0;
        // Check admin email
        var developer = model.Email.Equals("aslan_argun@hotmail.com");
        if (!firstRegister && model.Email != "aslan_argun@hotmail.com" && model.Roles.IndexOf("Developer") == -1 && !Permission("Admin"))
            return _help.Response("warning", "Permission is missing!");


        string errorMessage = String.Empty;
        try
        {
            // Hash password
            RNGCryptoServiceProvider provider = new();
            byte[] salt = new byte[model.Email.Length * 2];
            provider.GetBytes(salt);
            var hashedPassword = HashPassword(model, salt);

            // Create roles
            var roles = model?.Roles;


            if (developer || (roles?.Count == 0 && _users?.Count() == 0))
            {
                if (roles?.IndexOf("Admin") == -1)
                    roles.Add("Admin");
                if (roles?.IndexOf("Support") == -1)
                    roles.Add("Support");
            }

            roles?.Add("Users");
            // Create and save a user into the database
            var user = new User
            {
                Name = model?.Name,
                Email = model?.Email,
                Password = hashedPassword,
                PasswordVerefiritionCode = salt,
                Roles = roles?.Count > 0 ? string.Join(",", roles) : null
            };

            _db.Users?.Add(user);

            if (_help.Save())
            {
                if (firstRegister)
                {
                    var token = GenerateJwtToken(user);

                    var mailContent = "<h4>Hi " + model?.Name + "!</h4><br/>" +
                                      "<p>Welcome as a new user on {domain}.</p>" +
                                      "<p>Below are your login details. Please, save them for future reference.</p><br/>" +
                                      "<p>Username: " + model?.Email + "</p>" +
                                      "<p>Password: " + model?.Password + "</p><br/>";
                    // Send a mail to new user
                    //_help.SendMail(user.Email, "Välkommen " + model.Name, mailContent);

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
            var user = _users.FirstOrDefault(x => x.Email == model.Email);
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

    #region Helpers

    // Get claims 
    private bool Permission(string role)
    {
        //var claims = Users.Claims.ToList();
        var claimRoles = User.Claims?.FirstOrDefault(x => x.Type == "Roles")?.ToString();
        return claimRoles?.IndexOf(role) > -1;
    }

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

    // Verify password
    private bool VerifyPassword(string password, User model)
    {
        int keySize = (model.Email.Length * 2);
        var hashToCompare = Rfc2898DeriveBytes.Pbkdf2(password, model.PasswordVerefiritionCode, _iterations, _hashAlgorithm, keySize);
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
