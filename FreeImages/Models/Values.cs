using System.ComponentModel.DataAnnotations;

namespace FreeImages.Models;

public class Values
{
    [Key]
    public int Id { get; set; }
    public  string? Name { get; set; }
    public string? ValueString { get; set; }
    public bool ValueBool { get; set; }
}
