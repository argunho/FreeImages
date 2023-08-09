using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FreeImages.Controllers;

[Route("[controller]")]
[ApiController]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IHelpFunctions _help;
    private readonly IConfiguration _config;
    private readonly MailRepository _mail;
    private readonly DbConnect _db;

    public UserController(
            IHelpFunctions help,
            IConfiguration config,
            DbConnect db
        )
    {
        _help = help;
        _config = config;
        _mail = new MailRepository();
        _db = db;
    }

    public IEnumerable<User> AllUsers
    {
        get
        {
            return _db.Users?.ToList() ?? Enumerable.Empty<User>();
        }
    }


    #region GET
    [HttpGet]
    public List<User> Get() => AllUsers.ToList();

    [HttpGet("count")]
    [AllowAnonymous]
    public int UsersCount() => AllUsers.Count();

    [HttpGet("{id}")]
    public async Task<JsonResult> GetById(string? id)
    {
        var user = await _db.Users?.FirstOrDefaultAsync(x => x.Id == id);
        var permission = Permission("Admin");
        return new JsonResult(new { user, permission });
    }
    #endregion

    #region PUT
    [HttpPut("{id}")]
    public async Task<JsonResult> Put(string? id) {

        return _help.Response("error");
    }
    #endregion

    #region Helpers
    // Get claims 
    private bool Permission(string role)
    {
        var claimRoles = User.Claims?.FirstOrDefault(x => x.Type == "Roles")?.ToString();
        return claimRoles?.IndexOf(role) > -1;
    }

    // Get claim type
    public string? GetClaim(string name) =>
        User.Claims?.FirstOrDefault(x => x.Type == name)?.Value?.ToString();
    #endregion
}
