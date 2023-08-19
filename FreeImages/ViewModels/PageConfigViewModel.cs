using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreeImages.ViewModels;

public class PageConfigViewModel
{
    public string? Name { get; set; }

    public string? Text { get; set; }

    public string? TextColor { get; set; }

    public string? AdsApi { get; set; }

    public string? PayPal { get; set; }

    public string? Instagram { get; set; }

    [Column(TypeName = "varchar(MAX)")]
    public string? ImgString { get; set; }
}
