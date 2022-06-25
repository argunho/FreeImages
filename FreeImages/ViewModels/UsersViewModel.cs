using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FreeImages.ViewModels;

public class UsersViewModel
{

    public string Name { get; set; }
    public string Email { get; set; }
    public Guid LoginHash { get; set; }
    public DateTime Date { get; set; }

    public string[] Roles { get; set; }

    public UsersViewModel()
    {
        Date = DateTime.Now;
    }
}
