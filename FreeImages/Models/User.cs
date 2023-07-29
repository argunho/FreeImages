using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreeImages.Models;

[Keyless]
public class User 
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? Name { get; set; }
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? Roles { get; set; }
    [NotMapped]
    public List<string> ListRoles
    {
        get
        {
            return string.IsNullOrEmpty(Roles) ? new List<string>() : Roles.Split(',').ToList();
        }
        set
        {
            _ = string.Join(',', Roles);
        }
    }
    public Guid LoginHash { get; set; }
    public DateTime Date { get; set; } = DateTime.Now;
}
