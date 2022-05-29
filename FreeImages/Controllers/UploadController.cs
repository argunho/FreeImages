using Azure.Storage.Blobs;
using FreeImages.Data;
using FreeImages.Models;
using Microsoft.AspNetCore.Mvc;

namespace FreeImages.Controllers;
[Route("[controller]")]
[ApiController]
public class UploadController : ControllerBase
{
    private static string connectionString = "DefaultEndpointsProtocol=https;AccountName=imgsrepository;AccountKey=Eg7janEB1TatM4um1hQmzZJ+Dy/lF48O6FfDN6E+OfNsBcjm3Dx4S2u5ZUvo3To5TWiY4Uz2ll6N+AStXocS9Q==;EndpointSuffix=core.windows.net";
    private static string conatinerName = "imagescontainer";

    private BlobContainerClient _container;
    private FreeImagesDbConnect _db;

    public UploadController(FreeImagesDbConnect db)
    {
        _db = db;
        _container = new BlobContainerClient(connectionString, conatinerName);
    }

    #region POST
    [HttpPost]
    private JsonResult Post(UploadedImage model, IFormFile upploadedFile)
    {
        if (model == null || upploadedFile == null)
            return new JsonResult(new { res = "warning", msg = "Bild eller bild information saknas" });

        try
        {
        using (var stream = upploadedFile.OpenReadStream())
        {
            _container.UploadBlob(model.Img, stream);
        }
        }catch (Exception ex)
        {
            return new JsonResult(new { res = "error", msg = ex.Message }); 
        }

        return new JsonResult(true);
    }
    #endregion
}
