using FreeImages.Services;
using FreeImages.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FreeImages.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Support")]
    public class DataController : ControllerBase
    {
        private readonly IHttpContextAccessor _contextAccessor; 
        private readonly IHelpFunctions _help;
        private readonly ConfigurationService _config;
        public DataController(IHttpContextAccessor contextAccessor, IHelpFunctions help) { 
            _contextAccessor = contextAccessor;
            _help = help;
            _config = ConfigurationService.Load("BlobStorage");
        }

        #region POST
        [HttpPost("updateJsonFile")]
        public async Task<JsonResult> PostJson(JsonViewModel model) {

            if (!ModelState.IsValid)
                return _help.Response("warning", "Incorrect form data");

            var pathName = @$"ClientApp/src/asstes/json/{model.FileName}";
            if (System.IO.File.Exists(pathName))
            {
                try
                {
                    var jsonFile = await System.IO.File.ReadAllTextAsync(pathName);
                    var currentJsonContent = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, string>>(jsonFile);

                    currentJsonContent[model.Name?.ToString()] = model.JsonString;

                    var updatedJsonContent = Newtonsoft.Json.JsonConvert.SerializeObject(currentJsonContent);
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
}
