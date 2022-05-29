using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace FreeImages.Models;

public class User : IdentityUser
{
    public string? Name { get; set; }
}
