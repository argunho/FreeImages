using Azure.Storage.Blobs;
using FreeImages.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace FreeImages.Controllers
{
    [Route("[controller]")]
    [Authorize(Roles = "Admin,Support")]
    public class ImageController : ControllerBase
    {
        private readonly DbConnect _db;
        private readonly IHelpFunctions _help;
        private readonly ConfigurationService _config;
        private readonly BlobContainerClient _uploadContainer;
        private readonly BlobContainerClient _imageContainer;

        public ImageController(DbConnect db, IHelpFunctions help)
        {
            _db = db;
            _help = help;
            _config = ConfigurationService.Load("BlobStorage");
            _uploadContainer = new(_config.ConnectionString, "uploadfilecontainer");
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
        [HttpDelete("{idsString}")]
        public async Task<JsonResult> Delete(string idsString)
        {
            if (string.IsNullOrEmpty(idsString))
                return _help.Response("error", "Id missing!");

            List<int> ids = idsString.Split(",").Select(i => Convert.ToInt32(i)).ToList();

            try
            {
                var images = AllImages.Where(x => ids.Any(i => i == x.Id)).ToList();
                var listImages = _db.ListImages.Where(x => ids.Any(i => i == x.ImageId)).ToList();
                _db.ListImages?.RemoveRange(listImages);
                _db.Images?.RemoveRange(images);
                if (await _help.Save())
                {
                    foreach (var image in images)
                    {
                        await _uploadContainer.DeleteBlobAsync(image.Name);
                        //await _imageContainer.DeleteBlobAsync(image.Name);
                    }
                }
            }
            catch (Exception ex)
            {
                return _help.Response("error", ex.Message);
            }

            return _help.Response("success");
        }

        #endregion
    }
}
//?? Enumerable.Empty<ListImage>()