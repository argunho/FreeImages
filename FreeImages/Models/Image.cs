using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FreeImages.Models
{
    public class Image
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Keywords { get; set; }
        [NotMapped]
        public string? Path
        {
            get
            {
                return $"https://uploadfilerepository.blob.core.windows.net/uploadfilecontainer/{Name}";
            }
        }
        public byte[]? ImgInByte { get; set; }
        public string?  Author { get; set; }
        public bool Visible { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
    }
}
