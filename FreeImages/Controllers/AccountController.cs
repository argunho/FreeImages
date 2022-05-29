using FreeImages.Intefaces;
using FreeImages.Models;
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
    public AccountController(IHelpFunctions help, IConfiguration config)
    {
        _help = help;
        _config = config;
    }

    #region Helpers
    // Create Jwt Token for authenticating
    private string CreateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["FreeImagesJwt:Key"]));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
        IdentityOptions opt = new IdentityOptions();

        var claims = new List<Claim>();
        claims.Add(new Claim(ClaimTypes.Name, user.Name));
        claims.Add(new Claim("Email", user.Email));
 
        //foreach (var r in roles)
        //    claim.Add(new Claim(opt.ClaimsIdentity.RoleClaimType, r));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims.ToArray()),
            Expires = DateTime.Now.AddDays(3),
            SigningCredentials = credentials
        };

        var encodeToken = new JwtSecurityTokenHandler();
        var securityToken = encodeToken.CreateToken(tokenDescriptor);
        var token = encodeToken.WriteToken(securityToken);

        return token;
    }
    #endregion
}
