using FreeImages.Data;
using FreeImages.Intefaces;
using FreeImages.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FreeImages.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private FreeImagesDbConnect _db;
        private IHelpFunctions _help;

        public ImageController(FreeImagesDbConnect db, IHelpFunctions help)
        {
            _db = db;
            _help = help;
        }

        public IEnumerable<ImageData> AllImages
        {
            get
            {
                return _db.ImageData?.ToList() ?? Enumerable.Empty<ImageData>();
            }
        }

        #region GET
        [HttpGet]
      //[Authorize(Roles = "Admin,Support")]
        public IEnumerable<ImageData> Get() => AllImages;

        [HttpGet("images")]
        public IEnumerable<UploadedImage> GetImages() =>
            _db.UploadedImages?.OrderByDescending(x => x.Id).ToList() ?? Enumerable.Empty<UploadedImage>();
        #endregion
    }
}
