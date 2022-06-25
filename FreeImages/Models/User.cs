using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace FreeImages.Models;

public class User : IdentityUser
{
    public string? Name { get; set; }
    public Guid LoginHash { get; set; }
    public DateTime Date { get; set; }
    public User()
    {
        Date = DateTime.Now;
    }
}
