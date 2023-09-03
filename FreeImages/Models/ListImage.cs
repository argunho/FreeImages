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
            return $"https://uploadfilerepository.blob.core.windows.net/freeimagescontainer/{Name}";
        }
    }
    [Column(TypeName = "varchar(MAX)")]
    public string? Base64 { get; set; }

    [NotMapped]
    public string? Base64String
    {
        get
        {
            return "data:image/jpeg;base64," + Base64;
        }
    }

    [NotMapped]
    public string ImageHash => Name.GetHashCode().ToString();
            //return Name?.ToLower().Replace("_", "")[Name.IndexOf(".")..];
            

    [Required]
    public int ImageId { get; set; }
}
