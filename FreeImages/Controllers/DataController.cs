using FreeImages.Services;
using FreeImages.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace FreeImages.Controllers;

[Route("[controller]")]
[ApiController]
[Authorize(Roles = "Admin,Support")]
public class DataController : ControllerBase
{
    private readonly ConfigurationService _config;
    private readonly IHelpFunctions _help;
    private readonly IHandleImage _image;

    public DataController(IHelpFunctions help, IHandleImage image)
    {
        _config = ConfigurationService.Load("BlobStorage");
        _help = help;
        _image = image;
    }

    #region GET
    [HttpGet]
    public async Task<string> Get() => "Hello Aslan";
    #endregion

    #region POST
    [HttpPost("page")]
    public async Task<JsonResult> PostConfig(ConfigsViewModel model)
    {
        if (!ModelState.IsValid)
            return _help.Response("warning", "Incorrect form data");

        var pathName = PathName("ClientApp/src/assets/json");
        var configDataPath = pathName + "/configuration.json";
        var configBackgroundPath = pathName + "/background.json";

        if (!System.IO.File.Exists(configDataPath))
            return _help.Response("error", "Configuration file not found");
        else if (!System.IO.File.Exists(configBackgroundPath))
            return _help.Response("error", "Configuration file not found");

        try
        {
            var configFile = System.IO.File.ReadAllText(configDataPath);
            var currentConfig = JsonConvert.DeserializeObject<PageConfigModel>(configFile);
            currentConfig.Name = model.Name;
            currentConfig.Text = model.Text;
            currentConfig.TextColor = model.TextColor;
            currentConfig.AdsApi = model.AdsApi;
            currentConfig.Instagram = model.Instagram;
            currentConfig.PayPal = model.PayPal;

            await System.IO.File.WriteAllTextAsync(configDataPath, JsonConvert.SerializeObject(currentConfig));

            var backgroundFile = System.IO.File.ReadAllText(configBackgroundPath);
            var currentBackground = JsonConvert.DeserializeObject<BackgroundConfigModel>(backgroundFile);
            if (model.ImgString != null && model.ImgString != currentBackground.ImgString)
            {
                currentBackground.ImgString = model.ImgString;

                await System.IO.File.WriteAllTextAsync(configBackgroundPath, JsonConvert.SerializeObject(currentBackground));
            }

        }
        catch (Exception ex)
        {
            return _help.Response("error", ex.Message);
        }

        return _help.Response("success");
    }

    [HttpPost("seo")]
    public async Task<JsonResult> PostSeo(SeoViewModel model)
    {

        if (!ModelState.IsValid)
            return _help.Response("warning", "Incorrect form data");

        var pathName = PathName("ClientApp/src/assets/json") + "/seo.json";

        if (!System.IO.File.Exists(pathName))
            return _help.Response("error", "Seo file not found");

        try
        {
            var seoFile = System.IO.File.ReadAllText(pathName);
            var currentSeo = JsonConvert.DeserializeObject<SeoViewModel>(seoFile);

            currentSeo.Title = model.Title;
            currentSeo.Description = model.Description;
            currentSeo.Keywords = model.Keywords;
            currentSeo.Url = model.Url;
            currentSeo.Type = model.Type;

            if (!model.ImgString.IsNullOrEmpty() && model.ImgString != currentSeo?.ImgString && _image.Base64StringControl(model.ImgString))
            {
                IFormFile? uploadedFile = _image.Base64ToIFormFile(model?.ImgString, "seo");
                if (uploadedFile != null)
                {
                    var imgPath = PathName("ClientApp/src/assets") + "/seo." + $"{uploadedFile?.ContentType[(uploadedFile.ContentType.IndexOf("/") + 1)..]}";
                    using var stream = uploadedFile?.OpenReadStream();
                    var img = System.Drawing.Image.FromStream(stream);
                    img.Save(imgPath);
                    currentSeo.ImgString = imgPath;
                }
            }

            await System.IO.File.WriteAllTextAsync(pathName, JsonConvert.SerializeObject(currentSeo));

        }
        catch (Exception ex)
        {
            return _help.Response("error", ex.Message);
        }

        return _help.Response("success");
    }

    [HttpPost("storage")]
    public async Task<JsonResult> PostStorage(StorageConfigModel model)
    {
        if (!ModelState.IsValid)
            return _help.Response("warning", "Incorrect form data");
        try {
            _config.ConnectionString = model.Connection;
            var configFile = System.IO.File.ReadAllText("appsettings.json");
            var currentConfig = JsonConvert.DeserializeObject<Dictionary<string, object>>(configFile);
            if (currentConfig["BlobStorage"] != null)
                currentConfig["BlobStorage"] = _config;

            var configToUpdate = JsonConvert.SerializeObject(currentConfig);
            System.IO.File.WriteAllText("appsettings.json", configToUpdate);
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
