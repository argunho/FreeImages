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

        public IEnumerable<ListImage> AllImages
        {
            get
            {
                return _db.ListImages?.ToList() ?? Enumerable.Empty<ListImage>();
            }
        }

        #region GET
        [HttpGet]
      //[Authorize(Roles = "Admin,Support")]
        public IEnumerable<ListImage> Get() => AllImages;

        [HttpGet("{page}/{count}")]
        public IEnumerable<ListImage> GetImages(int page, int count) =>
            _db.ListImages?.OrderByDescending(x => x.Id).Skip(count * (page - 1))?.Take(count).ToList() ?? Enumerable.Empty<ListImage>();
        #endregion
    }
}
 //?? Enumerable.Empty<ListImage>()