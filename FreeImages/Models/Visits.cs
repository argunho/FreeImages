using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreeImages.Models;

public class Visits
{
    [Key]
    public int Id { get; set; }

    public string IpAdresses { get; set; } = String.Empty;
    [NotMapped]
    public List<string?> IpAddressesList
    {
        get
        {
            return string.IsNullOrEmpty(IpAdresses) ? new List<string?>() : IpAdresses?.Split(',').ToList();
        }
        set
        {
            _ = string.Join(",", value);
        }
    }
    public int Count { get; set; }
    public string Date { get; set; } = DateTime.Now.ToString("yyyy.MM.dd");
}
