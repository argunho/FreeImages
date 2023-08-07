using FreeImages.Data;
using FreeImages.Intefaces;
using FreeImages.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FreeImages.Controllers
{
    [Route("[controller]")]
    [Authorize(Roles = "Admin,Support")]
    public class ImageController : ControllerBase
    {
        private DbConnect _db;
        private IHelpFunctions _help;

        public ImageController(DbConnect db, IHelpFunctions help)
        {
            _db = db;
            _help = help;
        }

        public IEnumerable<ListImage> AllListImages
        {
            get
            {
                return _db.ListImages?.ToList() ?? Enumerable.Empty<ListImage>();
            }
        }

        public IEnumerable<Image> AllImages
        {
            get
            {
                return _db.Images?.ToList() ?? Enumerable.Empty<Image>();
            }
        }

        #region GET
        [HttpGet]
        public IEnumerable<Image> Get() => AllImages;

        [HttpGet("{page}/{count}")]
        [AllowAnonymous]
        public IEnumerable<ListImage> GetImages(int page, int count) =>
            AllListImages?.OrderByDescending(x => x.Id).Skip(count * (page - 1))?.Take(count).ToList() ?? Enumerable.Empty<ListImage>();
        #endregion

        #region DELETE
        [HttpDelete("{ids}")]
        public async Task<JsonResult> Delete(List<int> ids)
        {
            try
            {
                foreach (var image in AllImages.Where(x => ids.Any(i => i == x.Id))
                {
                    _db.Images.Remove(image);
                    _db.ListImages?.Remove(_db.ListImages.FirstOrDefault(x => x.ImageId == image.Id));
                    _c
                }

            } catch(Exception ex)
            {
                return _help.Response("error", ex.Message);
            }

            return _help.Response("success");
        }

        #endregion
    }
}
 //?? Enumerable.Empty<ListImage>()