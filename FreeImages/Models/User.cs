using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreeImages.Models;

public class User
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public byte[]? PasswordVerificationCode { get; set; }
    public string? Roles { get; set; }
    [NotMapped]
    public List<string> ListRoles
    {
        get
        {
            return string.IsNullOrEmpty(Roles) ? new List<string>() : Roles.Split(',').ToList();
        }
    }
    public string? LoginHash { get; set; }
    public Nullable<DateTime> LoginHashValidTime { get; set; }
    public DateTime Date { get; set; } = DateTime.Now;
}
