using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace FreeImages.Models;

public class Image
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Keywords { get; set; }
    [NotMapped]
    public string? ViewName
    {
        get
        {
            return string.IsNullOrEmpty(Name) ? String.Empty 
                : $"{((string.Concat(Name[..1].ToUpper(), Name[1..]))[..(Name.IndexOf("_") > -1 ? Name.LastIndexOf("_") : Name.Length)])}";
        }
    }
    [NotMapped]
    public string? Path
    {
        get
        {
            return $"https://uploadfilerepository.blob.core.windows.net/freeimagescontainer/{Name}";
        }
    }
    public byte[]? ImgInByte { get; set; }
    public User? Author { get; set; }
    public int? Width { get; set; }
    public int? Height { get; set; }
    public bool Visible { get; set; }
    public DateTime Date { get; set; } = DateTime.Now;
}
