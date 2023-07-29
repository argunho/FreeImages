using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FreeImages.ViewModels;

public class LoginViewModel
{
    [Required]
    [EmailAddress]
    public string? Email { get; set; }

    [Required]
    [DataType(DataType.Password)]
    public string? Password { get; set; }

    public bool Remember { get; set; }

    public string? Hash { get; set; }
}
