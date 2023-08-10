using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreeImages.Models;

public class ListImage
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string? Name { get; set; }
    [Required]
    public string? Keywords { get; set; }
    [NotMapped]
    public string? Path
    {
        get
        {
            return $"https://uploadfilerepository.blob.core.windows.net/uploadfilecontainer/{Name}";
        }
    }
    [Column(TypeName = "varchar(MAX)")]
    public string? Base64 { get; set; }
    [Required]
    public int ImageId { get; set; }
}
