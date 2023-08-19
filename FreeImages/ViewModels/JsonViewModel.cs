using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreeImages.ViewModels;

public class JsonViewModel
{
    [Required]
    public string? FileName { get; set; }

    [Required]
    [Column(TypeName = "varchar(MAX)")]
    public string? JsonString { get; set; }
    [Required]
    public string? Name { get; set; }
}
