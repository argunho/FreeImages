using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreeImages.ViewModels;

public class ConfigsViewModel
{
    public string? Name { get; set; }

    public string? Text { get; set; }

    public string? TextColor { get; set; }

    public string? SearchColor { get; set; }

    public string? AdsApi { get; set; }

    public string? PayPal { get; set; }

    public string? Instagram { get; set; }

    [Column(TypeName = "varchar(MAX)")]
    public string? ImgString { get; set; }

    public bool ConvertToBase64 { get; set; }
}

public class BackgroundConfigModel
{
    [Column(TypeName = "varchar(MAX)")]
    public string? ImgString { get; set; }
}

public class PageConfigModel
{
    public string? Name { get; set; }

    public string? Text { get; set; }

    public string? TextColor { get; set; }

    public string? AdsApi { get; set; }

    public string? PayPal { get; set; }

    public string? Instagram { get; set; }
}

public class StorageConfigModel
{
    public string? Connection { get; set; }
}