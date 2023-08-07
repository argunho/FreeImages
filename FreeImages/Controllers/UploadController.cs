using Azure.Storage.Blobs;
using FreeImages.Data;
using FreeImages.Intefaces;
using FreeImages.Models;
using GroupDocs.Metadata.Cloud.Sdk.Model;
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
    private static readonly string connectionString = "DefaultEndpointsProtocol=https;AccountName=uploadfilerepository;AccountKey=AtqMADGJ1jsZ+lHvdDP2ynlW9Sr8fKcr9ojNVTdXWeTfWd8q9izdY9hhRkjUg4abKfYWFXVgHe4D+ASt2brVDA==;EndpointSuffix=core.windows.net";

    private readonly BlobContainerClient _container = new(connectionString, "uploadfilecontainer");
    private readonly DbConnect _db;
    private readonly IHelpFunctions _help;

    public UploadController(DbConnect db, IHelpFunctions help)
    {
        _db = db;
        _help = help;
    }


    #region POST
    [HttpPost("{name}/{keywords}")]
    public async Task<JsonResult> Post(string name, string keywords, IFormFile uploadedFile)
    {
        if (uploadedFile == null)
            return _help.Response("warning", "An image file or image information missing!");

        // Images name
        var imgName = $"{name.ToLower().Replace(" ", "")}_{DateTime.Now.ToString("yyyyMMddHHmmss")}." +
                            $"{uploadedFile.ContentType[(uploadedFile.ContentType.IndexOf("/") + 1)..]}";
        //+uploadedFile.ContentType.Substring(uploadedFile.ContentType.IndexOf("/") + 1);

        try
        {
            var img = System.Drawing.Image.FromStream(uploadedFile.OpenReadStream());

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
                        break;

                    case 3: // bottoms up
                        img.RotateFlip(rotateFlipType: RotateFlipType.Rotate180FlipNone);
                        break;

                    case 6: // rotated 90 left
                        img.RotateFlip(rotateFlipType: RotateFlipType.Rotate90FlipNone);
                        break;
                }
            }

            // Temporary save
            using var imgStream = System.IO.File.OpenWrite(@$"Download/{imgName}");
            await uploadedFile.CopyToAsync(imgStream);

            // Upload to azure blob storage
            using var stream = uploadedFile.OpenReadStream();
            _container.UploadBlob(imgName, stream);

            // Get current user roles
            var claims = HttpContext.User.Claims.Where(x => x.Value == "Roles").ToList();
            var visible = claims?.ToString()?.IndexOf("Admin") > -1 || claims?.ToString()?.IndexOf("Support") > -1;

            ListImage uploadedImage = new();
            if (visible)
            {
                uploadedImage.Name = imgName;
                if (!_help.Save())
                    return _help.Response("error");
            }

            var author = HttpContext?.User?.Identity?.Name;

            var imgData = new Models.Image
            {
                Name = name,
                Keywords = keywords,
                Author = author ?? GetClaimsData("Name"),
                Visible = visible
            };

            _db.Images?.Add(imgData);

            if (_help.Save())
            {
                foreach (var image in _db.ListImages.ToList())
                {
                    image.Base64 = "data:image/jpeg;base64," + ImageToBase64(image, 500);
                }

                ListImage listImage = new()
                {
                    Name = imgName,
                    Keywords = keywords,
                    Width = img.Width,
                    Height = img.Height,
                    ImageId = imgData.Id
                };

                listImage.Base64 = "data:image/jpeg;base64," + ImageToBase64(listImage, 500);
                _db.ListImages?.Add(listImage);
                if (!_help.Save())
                    return _help.Response("warning");
            }
            else
                return _help.Response("warning");
        }
        catch (Exception ex)
        {
            return _help.Response("error", ex.Message);
        }

        return _help.Response("success");
    }
    #endregion

    #region Help Functions
    private string? GetClaimsData(string? value)
    {
        var claim = User.Claims?.FirstOrDefault(x => x?.Type == value);
        return claim?.Value.ToString();
    }

    // Convert image from path to base64 string
    public async Task<string> ImageToBase64(ListImage model, int resize = 0)
    {
        string imgBase = String.Empty;

        var blobImage = _container.GetBlobClient(model.Name);
        if (blobImage == null) return null;

        var path = $@"Download/{model.Name}";
        using FileStream fileStream = System.IO.File.OpenWrite(path);
        blobImage.DownloadToAsync(fileStream);

        if (!System.IO.File.Exists(path)) return null;
        try
        {
            using System.Drawing.Image img = System.Drawing.Image.FromFile(path);
            using MemoryStream m = new();
            System.Drawing.Image imageToConvert = img;
            //var devisionNumber = img.Width / resize;
            //var summa = img.Width / devisionNumber;
            //int height = (img.Height / devisionNumber);
            //imageToConvert = (System.Drawing.Image)(new Bitmap(img, new Size(resize, height)));

            //imageToConvert.Save(m, img?.RawFormat);
            byte[] imageBytes = m.ToArray();
            imgBase = Convert.ToBase64String(imageBytes);// Convert byte[] to Base64 String
        }
        catch (Exception ex)
        {
            Debug.WriteLine(ex.Message);
        }

        return imgBase;
    }
    #endregion
}


//var fileInfo = new GroupDocs.Metadata.Cloud.Sdk.Model.FileInfo
//{
//    FilePath = imgName
//};

//var options = new AddOptions
//{
//    FileInfo = fileInfo,
//    Properties = new List<AddProperty>
//    {
//        new AddProperty
//        {
//            Value = $"Copyright {DateTime.Now:yyyy}",
//            SearchCriteria = new SearchCriteria
//            {
//                TagOptions = new TagOptions
//                {
//                   PossibleName = "Copyright"
//                }
//            },
//            Type = "String",
//        }
//    }
//};