using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;
using FreeImages.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security;

namespace FreeImages.Controllers
{
    [Route("[controller]")]
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
            _blobContainer = new(_config.ConnectionString, "uploadfilecontainer");
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

        [HttpGet("{id:int}")]
        public async Task<Image?> GetById(int id)
            => await _db.Images.FirstOrDefaultAsync(x => x.Id == id);
        #endregion

        #region PUT
        [HttpPut("{id}")]
        public async Task<JsonResult> Put(int id, ListImage model)
        {
            try
            {
                var image = await _db.Images.FirstOrDefaultAsync(x => x.Id.Equals(id));
                if (image == null)
                  return _help.Response("warning", "No image found with matching Id.");

                var currentUserEmail = GetClaim("Email");

                if (!Permission("Admin,Support,Manager") && currentUserEmail != image?.Author?.Email)
                    return _help.Response("warning", "Permission denied!");

                // Blob image exists
                var blobImage = _blobContainer.GetBlockBlobClient(image?.Name);
                if(!await blobImage.ExistsAsync())
                {          
                    await Delete(image.Id.ToString());
                    return _help.Response("warning", "No image found with matching image name.");
                }

                image.Name = model.Name;
                image.Keywords = model.Keywords;

                var listImage = await _db.ListImages.FirstOrDefaultAsync(x => x.ImageId == id); 
                if (listImage == null) { 
                    var newlistImage = new ListImage { 
                        Name = image.Name,
                        Keywords = image.Keywords,
                        ImageId = image.Id
                    };
                } else
                {
                    listImage.Name = model.Name;
                    listImage.Keywords = model.Keywords;
                }

                if (!await _help.Save())
                    return _help.Response("error");
                else
                {
                    // Rename blob image name
                    if (image?.Name != model.Name)
                    {
                        var newBlobImage = _blobContainer.GetBlockBlobClient(model.Name);
                        if (!await newBlobImage.ExistsAsync())
                        {
                            await newBlobImage.StartCopyFromUriAsync(blobImage.Uri);
                            await blobImage.DeleteIfExistsAsync();
                        }
                    }
                }
            } catch (Exception ex)
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
        #endregion
    }
}

