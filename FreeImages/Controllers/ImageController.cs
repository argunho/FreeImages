using FreeImages.Data;
using FreeImages.Intefaces;
using FreeImages.Models;
using Microsoft.AspNetCore.Mvc;

namespace FreeImages.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private DbConnect _db;
        private IHelpFunctions _help;

        public ImageController(DbConnect db, IHelpFunctions help)
        {
            _db = db;
            _help = help;
        }

        public IEnumerable<Image> AllImages
        {
            get
            {
                return _db.Image?.ToList() ?? Enumerable.Empty<Image>();
            }
        }

        #region GET
        [HttpGet]
      //[Authorize(Roles = "Admin,Support")]
        public IEnumerable<Image> Get() => AllImages;

        [HttpGet("images/{page}/{count}")]
        public IEnumerable<Image> GetImages(int page, int count) =>
            _db.Image?.OrderByDescending(x => x.Id).Skip(count * (page - 1)).Take(count).ToList();
        #endregion
    }
}
 //?? Enumerable.Empty<PreviewImage>()