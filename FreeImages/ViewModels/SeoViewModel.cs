using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreeImages.ViewModels;

public class SeoViewModel
{
    public string? Title { get; set; }
    [DataType(DataType.Text)]
    public string? Description { get; set; }
    public string? Keywords { get; set; }

    [Column(TypeName = "varchar(MAX)")]
    public string? ImageUrl { get; set; }
    public string? Url { get; set; }
    public string? Type { get; set; }
}
