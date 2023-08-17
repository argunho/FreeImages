using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreeImages.ViewModels;

public class ImageViewModel
{
    [Required]
    public string? Name { get; set; }
    [Required]
    public string? Keywords { get; set; }

    [Column(TypeName = "varchar(MAX)")]
    public string? CroppedFile { get; set; }

    public IFormFile? FormFile { get; set; }
}
