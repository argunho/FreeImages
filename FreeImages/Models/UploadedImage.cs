using System.ComponentModel.DataAnnotations;

namespace FreeImages.Models
{
    public class UploadedImage
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Keywords { get; set; }
        public string? ImgName { get; set; }
        public string?  Author { get; set; }
        public bool Visible { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
    }
}
