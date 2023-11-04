using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;
using FreeImages.Services;
using FreeImages.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Drawing;
using System.Drawing.Imaging;
using System.Net;
using System.Runtime.InteropServices;
using DImage = System.Drawing.Image;
using ModelImage = FreeImages.Models.Image;

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


        // To get window donload folder pathname
        private static Guid FolderDownloads = new("374DE290-123F-4565-9164-39C4925E467B");
        [DllImport("shell32.dll", CharSet = CharSet.Auto)]
        private static extern int SHGetKnownFolderPath(ref Guid id, int flags, IntPtr token, out IntPtr path);

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

        public IEnumerable<ModelImage> AllImages
        {
            get
            {
                return _db.Images?.ToList() ?? Enumerable.Empty<ModelImage>();
            }
        }

        #region GET
        [HttpGet]
        public IEnumerable<ModelImage> Get() => AllImages.OrderByDescending(x => x.Id).ToList();

        [HttpGet("{page}/{count}")]
        [AllowAnonymous]
        public JsonResult GetImages(int page, int count)
        {
            var images = AllListImages;
            Random random = new();
            return new JsonResult(new { images = images?.Skip(count * (page - 1))?.Take(count)?.OrderBy(x => random.Next(20)).ToList(), count = images?.Count() });
        }

        [HttpGet("{page}/{count}/{keywords}")]
        [AllowAnonymous]
        public JsonResult? GetByKeywords(int page, int count, string? keywords = null)
        {
            if (keywords == null) return null;

            Random random = new();

            List<string>? keys = keywords?.Split(",").ToList();
            var images = AllListImages?.Where(x => x.Keywords != null && keys.Any(k => x.Keywords.Contains(k.ToLower())))?.ToList();
            return new JsonResult(new { images = images?.Skip(count * (page - 1))?.Take(count)?.OrderBy(x => random.Next(20)).ToList(), count = images?.Count });
        }


        [HttpGet("{id:int}")]
        public async Task<ModelImage?> GetById(int id)
            => await _db.Images.FirstOrDefaultAsync(x => x.Id == id);

        [HttpGet("getImage/{hash}")]
        [AllowAnonymous]
        public ModelImage? GetByName(string hash)
        {
            try
            {
                var imgs = AllImages;
                return imgs.FirstOrDefault(x => x.ImageHash == hash); ;

            }
            catch (Exception ex)
            {
                var erro = ex.Message;
                return null;
            }
        }

        [HttpGet("download/{id}/{value}")]
        [AllowAnonymous]
        public IActionResult DownloadImage(int? id, double value)
        {
            try
            {
                var image = _db.Images.FirstOrDefault(x => x.Id == id);

                if (image == null)
                    return NotFound();

                //var url = image.Path;
                //var imageName = new Uri(url).Segments.LastOrDefault();
                //var imageFromBlob = _blobContainer.GetBlobClient(imageName);


                // Resize image
                WebClient web = new();
                byte[] bytes = web.DownloadData(image.Path);
                using var stream = new MemoryStream(bytes);
                using DImage img = DImage.FromStream(stream);
                DImage resizedImg = ResizeImage(img, value);
                var imgName = $"{image.ViewName}_{resizedImg.Width}x{resizedImg.Height}_{DateTime.Now.ToString("yyyyMMddHHmmss")}.{img.RawFormat}";
                var downloadPath = Path.Combine(GetWindowsDownloadsPath(), imgName);
                resizedImg.Save(downloadPath, img.RawFormat);
                stream.Position = 0;
                img.Dispose();
                stream.Dispose();
            }
            catch (Exception ex)
            {
                return Ok($"Something went wrong.\nError: {ex.Message}");
            }


            return Ok("Image downloaded successfully!");
        }
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
                var keywords = model?.Keywords?.ToLower();

                if (keywords?.IndexOf(model.Name?.ToLower()) > -1)
                    keywords += $", {model.Name?.ToLower()}";

                if (nameIsChanged)
                    imageName = $"{model?.Name?.ToLower().Replace(" ", "_")}_{DateTime.Now:yyyyMMddHHmmss}{image?.Name[image.Name.LastIndexOf(".")..]}";

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

        // Resize image
        public DImage ResizeImage(DImage img, double resizeValue)
        {
            var devisionNumber = img.Width / resizeValue;
            if (devisionNumber > 100)
                devisionNumber = img.Width / devisionNumber;

            int height = Convert.ToInt32(img.Height / devisionNumber);
            int width = Convert.ToInt32(img.Width / devisionNumber);
            return new Bitmap(img, new Size(width, height)) as DImage;
        }

        public static string GetWindowsDownloadsPath()
        {
            if (Environment.OSVersion.Version.Major < 6) throw new NotSupportedException();

            IntPtr pathPtr = IntPtr.Zero;

            try
            {
                SHGetKnownFolderPath(ref FolderDownloads, 0, IntPtr.Zero, out pathPtr);
                return Marshal.PtrToStringUni(pathPtr);
            }
            finally
            {
                Marshal.FreeCoTaskMem(pathPtr);
            }
        }
        #endregion
    }
}

