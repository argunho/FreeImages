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
            return _db.User?.ToList() ?? Enumerable.Empty<User>();
        }
    }


    #region GET
    [HttpGet]
    public List<User> Get() => AllUsers.ToList();

    [HttpGet("count")]
    [AllowAnonymous]
    public int UsersCount() => AllUsers.Count();
    #endregion
}
