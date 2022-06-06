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
    private FreeImagesDbConnect _db;
    private IHelpFunctions _help;

    public UploadController(FreeImagesDbConnect db, IHelpFunctions help)
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

        var imgName = name.Replace(" ", "") + "." + uploadedFile.ContentType.Substring(uploadedFile.ContentType.IndexOf("/") + 1);
        try
        {
            using (var stream = uploadedFile.OpenReadStream())
            {
                _container.UploadBlob(imgName, stream);
            }
        }catch (Exception ex)
        {
            return _help.Error(ex.Message); 
        }

        var imgData = new UploadedImage
        {
            Name = name,
            Keywords = keywords,
            ImgName = imgName,
            Author = "",
            Visible = true
        };

        _db.UploadedImages?.Add(imgData);
        if(!_help.Save())
            return _help.Error();

        return new JsonResult(true);
    }
    #endregion
}
