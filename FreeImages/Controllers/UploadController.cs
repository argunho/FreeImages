using Azure.Storage.Blobs;
using FreeImages.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Drawing;

namespace FreeImages.Controllers;

[Route("[controller]")]
[ApiController]
[Authorize]
public class UploadController : ControllerBase
{
    private readonly BlobContainerClient _blobContainer;
    private readonly DbConnect _db;
    private readonly IHelpFunctions _help;
    private readonly ConfigurationService _config;

    public UploadController(DbConnect db, IHelpFunctions help)
    {
        _db = db;
        _help = help;
        _config = ConfigurationService.Load("BlobStorage");
        _blobContainer = new(_config.ConnectionString, "freeimagescontainer");
        _blobContainer.CreateIfNotExists();
    }


    #region POST
    [HttpPost("{name}/{keywords}")]
    public async Task<JsonResult> Post(string name, string keywords, IFormFile uploadedFile)
    {
        if (uploadedFile == null)
            return _help.Response("warning", "An image file or image information missing!");

        // New image name
        var imgName = $"{name.ToLower().Replace(" ", "")}_{DateTime.Now:yyyyMMddHHmmss}." +
                            $"{uploadedFile.ContentType[(uploadedFile.ContentType.IndexOf("/") + 1)..]}";

        try
        {
            var path = @$"Download/{imgName}";


            using var stream = uploadedFile.OpenReadStream();
            
            var img = System.Drawing.Image.FromStream(stream);
            bool rotated = false
            // Rotate img
            if (img != null && img.PropertyIdList.Contains(0x0112))
            {
                int rotationValue = img.GetPropertyItem(0x0112).Value[0];
                switch (rotationValue)
                {
                    case 1: // landscape, do nothing
                        break;

                    case 8: // rotated 90 right
                        img.RotateFlip(rotateFlipType: RotateFlipType.Rotate270FlipNone);
                        rotated = true;
                        break;

                    case 3: // bottoms up
                        img.RotateFlip(rotateFlipType: RotateFlipType.Rotate180FlipNone);
                        rotated = true;
                        break;

                    case 6: // rotated 90 left
                        img.RotateFlip(rotateFlipType: RotateFlipType.Rotate90FlipNone);
                        rotated = true;
                        break;
                }
            }

            //// Temporary save uploaded image
            //using (var downloadPath = System.IO.File.OpenWrite(path)) // <= Save to download folder uploded file
            //await uploadedFile.CopyToAsync(downloadPath);
            

            if(rotated)
            {
                img.Save(path);
                // Upload original image to azure blob storage
                BlobClient blobClient = _blobContainer.GetBlobClient(imgName);
                await blobClient.UploadAsync(Path.Combine("Download", imgName), true);
            }
            else
            {
                // Save to blob container folder uploded file
                await _blobContainer.UploadBlobAsync(imgName, stream); 
            }

            //// Resize image
            //if (System.IO.File.Exists(path))
            //{
            //    using System.Drawing.Image image = System.Drawing.Image.FromFile(path);
            //    try
            //    {
            //        using var downlodStream = new MemoryStream();
            //        var resizedImage = ResizedImage(image, 300);
            //        resizedImage.Save(downlodStream, image.RawFormat);
            //        downlodStream.Position = 0;
            //        await _blobContainer.UploadBlobAsync("resized_" + imgName, downlodStream);
            //    }
            //    catch (Exception e)
            //    {
            //        Console.Error.WriteLine(e.Message);
            //    }
            //}

            var visible = Permission("Admin,Support,Manager");

            ListImage uploadedImage = new();
            if (visible)
            {
                uploadedImage.Name = imgName;
                if (!await _help.Save())
                    return _help.Response("error");
            }

            var author = await _db.Users.FirstOrDefaultAsync(x => x.Email == GetClaimsData("Email"));

            var imgData = new Models.Image
            {
                Name = imgName,
                Keywords = keywords,
                Author = author,
                Width = img.Width,
                Height = img.Height,
                Visible = visible
            };

            _db.Images?.Add(imgData);

            if (await _help.Save())
            {
                ListImage listImage = new()
                {
                    Name = imgName,
                    Keywords = keywords,
                    ImageId = imgData.Id
                };

                listImage.Base64 = "data:image/jpeg;base64," + ImageToBase64(listImage, 500);
                _db.ListImages?.Add(listImage);
                if (!await _help.Save())
                    return _help.Response("warning");
            }
            else
                return _help.Response("warning");
            
            System.IO.File.Delete(path);
        }
        catch (Exception ex)
        {
            return _help.Response("error", ex.Message);
        }

        return _help.Response("success");
    }
    #endregion

    #region Help Functions    
    // Check permission
    private bool Permission(string roles)
    {
        var claimRoles = User.Claims?.FirstOrDefault(x => x.Type == "Roles")?.Value.Split(",").ToList();
        return claimRoles?.Count(x => roles.Split(",").Any(r => r == x)) > 0;
    }
    private string? GetClaimsData(string? value) =>
        User.Claims?.FirstOrDefault(x => x?.Type == value)?.Value.ToString();

    // Convert image from path to base64 string
    public string? ImageToBase64(ListImage? model, int resizeNumber = 0)
    {
        string imgBase = String.Empty;

        var path = $@"Download/{model?.Name}";
        if (!System.IO.File.Exists(path)) return null;
        try
        {
            using (var img = System.Drawing.Image.FromFile(path))
            {
                using MemoryStream m = new();
                System.Drawing.Image imageToConvert = img;
                if (resizeNumber > 0)
                    imageToConvert = ResizedImage(img, resizeNumber);

                imageToConvert?.Save(m, img.RawFormat);
                byte[] imageBytes = m.ToArray();
                imgBase = Convert.ToBase64String(imageBytes);// Convert byte[] to Base64 String         
            }
            System.IO.File.Delete(path);
        }
        catch (Exception ex)
        {
            Debug.WriteLine(ex.Message);
        }

        return imgBase;
    }

    public System.Drawing.Image ResizedImage(System.Drawing.Image img, int resizeNumber)
    {
        var devisionNumber = img.Width / resizeNumber;
        //var summa = img.Width / devisionNumber;
        int height = (img.Height / devisionNumber);
        return new Bitmap(img, new Size(resizeNumber, height)) as System.Drawing.Image;
    }
    #endregion
}