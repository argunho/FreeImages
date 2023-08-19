using FreeImages.Services;
using FreeImages.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace FreeImages.Controllers;

[Route("[controller]")]
[ApiController]
[Authorize(Roles = "Admin,Support")]
public class DataController : ControllerBase
{
    private readonly IHelpFunctions _help;
    private readonly ConfigurationService _config;

    public DataController(IHelpFunctions help) { 
        _help = help;
        _config = ConfigurationService.Load("BlobStorage");
    }

    #region GET
    [HttpGet]
    public async Task<string> Get() => "Hello Aslan";
    #endregion

    #region POST
    [HttpPost("updateJsonFile")]
    public async Task<JsonResult> PostJson(JsonViewModel model) 
    {

        if (!ModelState.IsValid)
            return _help.Response("warning", "Incorrect form data");

        var pathName = @$"ClientApp/src/assets/json/{model.FileName}";
        if (System.IO.File.Exists(pathName))
        {
            try
            {
                var jsonFile = System.IO.File.ReadAllText(pathName);
                var currentJsonContent = JsonConvert.DeserializeObject<JsonContent>(jsonFile);
                //var img = currentJsonContent[model.Name?.ToString()];
                // currentJsonContent[model.Name?.ToString()] = model.JsonString;

                var updatedJsonContent = JsonConvert.SerializeObject(currentJsonContent);
                await System.IO.File.WriteAllTextAsync(pathName, updatedJsonContent);
            } catch (Exception ex)
            {
                return _help.Response("error", ex.Message);
            }
        }

        return _help.Response("success");
    }
    #endregion
}
