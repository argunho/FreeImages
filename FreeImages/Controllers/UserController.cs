using FreeImages.Models;
using FreeImages.ViewModels;
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
    public async Task<User?> GetById(string? id) => 
        await _db.Users.FirstOrDefaultAsync(x => x.Id == id);
    #endregion

    #region PUT
    [HttpPut("{id}")]
    public async Task<JsonResult> Put(string? id, User model) {
        var user = AllUsers.FirstOrDefault(x => x.Id == id);
        if(user == null)
            return _help.Response("error", "Users with matching emails have not been found ...");

        var currentEmail = GetClaim("Email");
        if (user.Email != currentEmail)
        {
            if (user.Roles?.IndexOf("Admin") > -1 && !Permission("Support,Admin"))
                return _help.Response("error", "Permission denied!");
        }

        try
        {
            user.Name = model.Name;
            user.Email = model.Email;
            user.Roles = model?.Roles;
            if (!await _help.Save())
                return _help.Response("error");
        }catch (Exception ex)
        {
            return _help.Response("error", $"Failed to try to change user data. Error: {ex.Message}");
        }

        return _help.Response("success");
    }
    #endregion

    #region Delete
    [HttpDelete("{ids}")]
    [Authorize(Roles = "Admin,Support")]
    public async Task<JsonResult> Delete(string? ids)
    {
        try
        {
            if (string.IsNullOrEmpty(ids))
                return _help.Response("error", "Id missing!");

            List<string> idsList = ids.Split(",").ToList();
            var users = AllUsers.Where(x => idsList.Any(i => i == x.Id)).ToList();
            var permission = Permission("Support");
            if (users.Any(x => x.Roles?.IndexOf("Admin") > -1) && !permission)
                return _help.Response("error", "Permission denied!");

            var images = _db.Images.Where(x => users.Any(u => u == x.Author)).ToList();
            if(images.Count > 0)
            {
                foreach (var image in images)
                {
                    image.Author = null;
                }

                await _help.Save();
            }

            _db.Users?.RemoveRange(users);
            if (!await _help.Save())
                return _help.Response("error");

        } catch(Exception ex)
        {
            return _help.Response("error", ex.Message);
        }

        return _help.Response("success");
    }

    [HttpDelete("profile/{id}")]
    public async Task<JsonResult> DeleteProfile(string? id)
    {
        if (string.IsNullOrEmpty(id))
            return _help.Response("error", "Id missing!");

        var user = AllUsers.FirstOrDefault(x => id == x.Id);
        if (user == null)
            return _help.Response("error", "Users with matching emails have not been found ...");

        var permission = Permission("Support");
        var currentEmail = GetClaim("Email");
        if (user.Roles?.IndexOf("Admin") > -1 && !permission && currentEmail != user.Email)
            return _help.Response("error", "Permission denied!");

        _db.Users?.Remove(user);
        if (!await _help.Save())
            return _help.Response("error");

        return _help.Response("success");
    }
    #endregion

    #region Helpers
    // Check permission
    private bool Permission(string roles)
    {
        var claimRoles = User.Claims?.FirstOrDefault(x => x.Type == "Roles")?.Value.Split(",").ToList();
        return claimRoles?.Count(x => roles.Split(",").Any(r => r == x)) > 0;
    }

    // Get claim type
    public string? GetClaim(string name) =>
        User.Claims?.FirstOrDefault(x => x.Type == name)?.Value?.ToString();
    #endregion
}
