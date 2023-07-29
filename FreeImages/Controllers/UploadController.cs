using Azure.Storage.Blobs;
using FreeImages.Data;
using FreeImages.Intefaces;
using FreeImages.Models;
using Microsoft.AspNetCore.Mvc;

namespace FreeImages.Controllers;
[Route("[controller]")]
[ApiController]
public class UploadController : ControllerBase
{
    private static string connectionString = "DefaultEndpointsProtocol=https;AccountName=uploadfilerepository;AccountKey=AtqMADGJ1jsZ+lHvdDP2ynlW9Sr8fKcr9ojNVTdXWeTfWd8q9izdY9hhRkjUg4abKfYWFXVgHe4D+ASt2brVDA==;EndpointSuffix=core.windows.net";
    private static string conatinerName = "uploadfilecontainer";

    private BlobContainerClient _container = new BlobContainerClient(connectionString, conatinerName);
    private DbConnect _db;
    private IHelpFunctions _help;

    public UploadController(DbConnect db, IHelpFunctions help)
    {
        _db = db;
        _help = help;
    }


    #region POST
    [HttpPost("{name}/{keywords}/{text}")]
    public JsonResult Post(string name, string keywords, IFormFile uploadedFile)
    {
        if (uploadedFile == null)
            return new JsonResult(new { res = "warning", msg = "Bild eller bild information saknas" });

        // Image name
        var imgName = name.Replace(" ", "") + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + "." 
            + uploadedFile.ContentType.Substring(uploadedFile.ContentType.IndexOf("/") + 1);

        // If the imag alreade exists
        if (_db.PreviewImages?.FirstOrDefault(x => x.Name == imgName) != null)
            return _help.Response("warning", "Image with the same name already exists");

        try
        {
            // Upload to azure blob storage
            using (var stream = uploadedFile.OpenReadStream())
            {
                _container.UploadBlob(imgName, stream);
            }
        }
        catch (Exception ex)
        {
            return _help.Response("error", ex.Message);
        }

        // Get current user roles
        var claims = HttpContext.User.Claims.Where(x => x.Value == "Roles").ToList();
        var visible = claims?.ToString()?.IndexOf("Admin") > -1 || claims?.ToString()?.IndexOf("Support") > -1;

        PreviewImage uploadedImage = new PreviewImage();
        if (visible)
        {
            uploadedImage.Name = imgName;
            if (!_help.Save())
                return _help.Response("error");
        }

        var imgData = new Image
        {
            Name = name,
            Keywords = keywords,
            Author = HttpContext?.User?.Identity?.Name,
            Visible = visible
        };

        _db.Image?.Add(imgData);

        if (!_help.Save())
        {
            _db.PreviewImages?.Remove(uploadedImage);
            _help.Save();
            return _help.Response("error");
        }

        return _help.Response("success");
    }
    #endregion
}
