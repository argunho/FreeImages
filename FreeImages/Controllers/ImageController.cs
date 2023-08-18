using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;
using FreeImages.Services;
using FreeImages.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security;

namespace FreeImages.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class ImageController : ControllerBase
    {
        private readonly DbConnect _db;
        private readonly IHelpFunctions _help;
        private readonly ConfigurationService _config;
        private readonly BlobContainerClient _blobContainer;

        public ImageController(DbConnect db, IHelpFunctions help)
        {
            _db = db;
            _help = help;
            _config = ConfigurationService.Load("BlobStorage");
            _blobContainer = new(_config.ConnectionString, "freeimagescontainer");
        }

        public IEnumerable<ListImage> AllListImages
        {
            get
            {
                return _db.ListImages?.OrderByDescending(x => x.Id).ToList() ?? Enumerable.Empty<ListImage>();
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
        public IEnumerable<Image> Get() => AllImages.OrderByDescending(x => x.Id).ToList();

        [HttpGet("{page}/{count}")]
        [AllowAnonymous]
        public JsonResult GetImages(int page, int count)
        {
            var images = AllListImages?.Skip(count * (page - 1))?.Take(count)?.ToList();
            return new JsonResult(new { images, count = images?.Count });
        }

        [HttpGet("{page}/{count}/{keywords}")]
        [AllowAnonymous]
        public JsonResult? GetByKeywords(int page, int count, string? keywords = null)
        {
            if (keywords == null) return null;

            List<string>? keys = keywords?.Split(",").ToList();
            var images = AllListImages?.Where(x => x.Keywords != null && keys.Any(k => x.Keywords.Contains(k)))?.Skip(count * (page - 1))?.Take(count)?.ToList();
            return new JsonResult(new { images, count = images?.Count });
        }


        [HttpGet("{id:int}")]
        public async Task<Image?> GetById(int id)
            => await _db.Images.FirstOrDefaultAsync(x => x.Id == id);
        #endregion

        #region PUT
        [HttpPut("update/{id:int}")]
        public async Task<JsonResult> Put(int id, ImageViewModel model)
        {
            try
            {
                var image = await _db.Images.FirstOrDefaultAsync(x => x.Id == id);
                var imageName = image.Name;
                var nameIsChanged = (image?.ViewName != model?.Name);
                var keywords = model.Keywords;

                if (model?.Keywords?.IndexOf(model.Name?.ToLower()) > -1)
                    keywords += $", {model.Name?.ToLower()}";

                if (nameIsChanged)
                    imageName = $"{model?.Name?.ToLower().Replace(" ", "")}_{DateTime.Now:yyyyMMddHHmmss}{image?.Name[image.Name.LastIndexOf(".")..]}";

                if (image == null)
                    return _help.Response("warning", "No image found with matching Id.");

                var currentUserEmail = GetClaim("Email");

                if (!Permission("Admin,Support,Manager") && currentUserEmail != image?.Author?.Email)
                    return _help.Response("warning", "Permission denied!");

                // Blob image exists
                var blobImage = _blobContainer.GetBlockBlobClient(image?.Name);
                if (!await blobImage.ExistsAsync())
                {
                    await Delete(image.Id.ToString());
                    return _help.Response("warning", "No image found with matching image name.");
                }

                image.Name = imageName;
                image.Keywords = keywords;

                var listImage = await _db.ListImages.FirstOrDefaultAsync(x => x.ImageId == id);
                if (listImage == null)
                {
                    var newlistImage = new ListImage
                    {
                        Name = imageName,
                        Keywords = keywords,
                        ImageId = image.Id
                    };
                }
                else
                {
                    listImage.Name = imageName;
                    listImage.Keywords = keywords;
                }

                if (!await _help.Save())
                    return _help.Response("error");
                else
                {
                    // Rename blob image name
                    if (nameIsChanged)
                    {
                        var newBlobImage = _blobContainer.GetBlockBlobClient(imageName);
                        if (!await newBlobImage.ExistsAsync())
                        {
                            await newBlobImage.StartCopyFromUriAsync(blobImage.Uri);
                            await blobImage.DeleteIfExistsAsync();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return _help.Response("error", "Error: " + ex.Message);
            }

            return _help.Response("success");
        }
        #endregion

        #region DELETE
        [HttpDelete("{ids}")]
        public async Task<JsonResult> Delete(string ids)
        {
            if (string.IsNullOrEmpty(ids))
                return _help.Response("error", "Id missing!");

            List<int> idsList = ids.Split(",").Select(i => Convert.ToInt32(i)).ToList();

            try
            {
                var images = AllImages.Where(x => idsList.Any(i => i == x.Id)).ToList();
                var listImages = _db.ListImages.Where(x => idsList.Any(i => i == x.ImageId)).ToList();
                _db.ListImages?.RemoveRange(listImages);
                _db.Images?.RemoveRange(images);
                if (await _help.Save())
                {
                    foreach (var image in images)
                    {
                        var blobImage = _blobContainer.GetBlockBlobClient(image.Name);
                        await blobImage.DeleteIfExistsAsync();
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

        #region Helpers
        // Check permission
        private bool Permission(string roles)
        {
            var claimRoles = User.Claims?.FirstOrDefault(x => x.Type == "Roles")?.Value.Split(",").ToList();
            return claimRoles?.Count(x => roles.Split(",").Any(r => r == x)) > 0;
        }

        // Get claim type
        public string? GetClaim(string name) =>
            User.Claims?.FirstOrDefault(x => x.Type == name)?.Value?.ToString();

        // Convert Base64 image string to IFormFile
        public IFormFile? Base64ToIFormFile(string base64string, string name)
        {
            if (base64string == null || name == null)
                return null;
            try
            {
                var str = base64string.Substring(base64string.IndexOf(",") + 1);
                byte[] bytes = Convert.FromBase64String(str);
                MemoryStream stream = new(bytes);

                return new FormFile(stream, 0, bytes.Length, "image/jpeg", name)
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "image/jpeg"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }

        }
        #endregion
    }
}

