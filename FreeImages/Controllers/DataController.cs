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

    public DataController(IHelpFunctions help)
    {
        _help = help;
        _config = ConfigurationService.Load("BlobStorage");
    }

    #region GET
    [HttpGet]
    public async Task<string> Get() => "Hello Aslan";
    #endregion

    #region POST
    [HttpPost("updateJsonFile")]
    public async Task<JsonResult> PostJson(PageConfigViewModel model)
    {

        if (!ModelState.IsValid)
            return _help.Response("warning", "Incorrect form data");

        var pathName = PathName("ClientApp/src/assets/json") + "/configuration.json";

        if (!System.IO.File.Exists(pathName))
            return _help.Response("error", "Json file not found");

        try
        {
            var jsonFile = System.IO.File.ReadAllText(pathName);
            var currentJsonContent = JsonConvert.DeserializeObject<PageConfigViewModel>(jsonFile);
            //currentJsonContent[model.Name?.ToString()] = model.ImgString;

            var updatedJsonContent = JsonConvert.SerializeObject(model);
            await System.IO.File.WriteAllTextAsync(pathName, updatedJsonContent);
        }
        catch (Exception ex)
        {
            return _help.Response("error", ex.Message);
        }

        return _help.Response("success");
    }
    #endregion

    #region Helpers
    public string PathName(string path)
    {
        var pathName = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, path));
        if (!Directory.Exists(pathName))
            pathName = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "wwwroot/static"));

        return pathName;
    }
    #endregion
}
