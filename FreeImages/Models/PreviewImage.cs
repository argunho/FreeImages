using System.ComponentModel.DataAnnotations;

namespace FreeImages.Models;

public class PreviewImage
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string? Name { get; set; }
    [Required]
    public string? Keywords { get; set; }
    [Required]
    public string? Path { get; set; }
    public string? Base64 { get; set; }
    [Required]
    public int ImageId { get; set; }
}
