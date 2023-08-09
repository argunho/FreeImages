using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography;

namespace FreeImages.ViewModels;

public class AccountViewModel
{
    public string? Id { get; set; }

    [Required]
    public string? Name { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; } = String.Empty;

    [StringLength(30, MinimumLength = 6)]
    [DataType(DataType.Password)]
    public string? CurrentPassword { get; set; }

    [Required]
    [StringLength(30, MinimumLength = 6)]
    [DataType(DataType.Password)]
    public string? Password { get; set; }

    [StringLength(30, MinimumLength = 6)]
    [DataType(DataType.Password)]
    public string? ConfirmPassword { get; set; }

    public string? Roles { get; set; }

    [NotMapped]
    public List<string> ListRoles
    {
        get
        {
            return string.IsNullOrEmpty(Roles) ? new List<string>() : Roles.Split(',').ToList();
        }
    }

    public bool Newsletter { get; set; }

}
