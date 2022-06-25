using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FreeImages.ViewModels;

public class PasswordViewModel
{
    [Required]
    [StringLength(30, MinimumLength = 6)]
    [DataType(DataType.Password)]
    [Display(Name = "Nuvarande lösenord")]
    public string CurrentPassword { get; set; }

    [Required]
    [StringLength(30, MinimumLength = 6)]
    [DataType(DataType.Password)]
    [Display(Name = "Lösenord")]
    public string Password { get; set; }

    [DataType(DataType.Password)]
    [Display(Name = "Bekräfta lösenord")]
    [Compare("Password", ErrorMessage = "Lösenordet och bekräftelseslösenordet matchar inte.")]
    public string ConfirmPassword { get; set; }
}
