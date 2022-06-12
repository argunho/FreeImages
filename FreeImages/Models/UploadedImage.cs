using System.ComponentModel.DataAnnotations;

namespace FreeImages.Models;

public class UploadedImage
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string? ImgName { get; set; }
}
