using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;

namespace FreeImages.Controllers;

[Route("[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IHelpFunctions _help;
    private readonly IConfiguration _config;
    private readonly ILogger<AccountController> _logger;
    private readonly MailRepository _mail;
    private readonly DbConnect _db;
    private HashAlgorithmName _hashAlgorithm;

    const int _iterations = 3500000;

    public UserController(
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
