using System.ComponentModel.DataAnnotations;

namespace FreeImages.Models
{
    public class UploadedImage
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        public string ImgName { get; set; }
        public string? Keywords { get; set; }
        public string? Text { get; set; }
        public string? Img { get; set; }
    }
}
