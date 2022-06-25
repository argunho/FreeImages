using FreeImages.Intefaces;
using FreeImages.Models;
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

    public AccountController(
        IHelpFunctions help,
        IConfiguration config,
                    UserManager<User> userManager,
            SignInManager<User> signInManager,
            ILogger<AccountController> logger,
            RoleManager<IdentityRole> roleManager
        )
    {
        _help = help;
        _config = config;
        _userManager = userManager;
        _logger = logger;
        _signInManager = signInManager;
        _roleManager = roleManager;
    }

    #region GET
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
                return Ok("The new password has been sent, check your email");
            }
        }
        return BadRequest("Failed to save new password, please try again later ...");
    }
    #endregion

    #region Post
    [HttpPost("Register")] // Register
    [Authorize(Roles = "Admin, Support")]
    public async Task<IActionResult> Register(AccountViewModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest();
        if (!_help.CheckEmail(model.Email))
            return BadRequest("Incorrect email address");

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
                if (roles.IndexOf("Service") == -1)
                    roles.Add("Service");
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

            return Ok("Registration was successful!");
        }

        var error_msg = "";
        foreach (var error in result.Errors)
        {
            ModelState.AddModelError(string.Empty, error.Description);
            error_msg += error.Description + " ";
        }

        return BadRequest(error_msg);
    }

    [HttpPost("Login")] // Logga in
    public async Task<IActionResult> SignIn(LoginViewModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest("Formulärdata är felaktigt ifyllda");
        else if (!_help.CheckEmail(model.Email))
            return BadRequest("Felaktig e-postadress");

        // This doesn't count login failures towards account lockout
        // To enable password failures to trigger account lockout, set lockoutOnFailure: true
        var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.Remember, lockoutOnFailure: true);
        if (result.Succeeded)
        {
            var user = await _userManager.FindByNameAsync(model.Email);
            var currentRoles = _userManager.GetRolesAsync(user).Result;

            var days = (model.Remember) ? 30 : 1;
            var token = GenerateJwtToken(user, currentRoles.ToList(), days);
            return Ok(new { success = true, token = token, user = user.Name });
        }
        return BadRequest((result.IsLockedOut) ? "User account locked out. Please try again later ..."
                : "Incorrect email address or password");
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
