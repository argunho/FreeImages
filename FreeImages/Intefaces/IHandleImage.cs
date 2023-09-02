using Microsoft.AspNetCore.Http;

namespace FreeImages.Intefaces;

public interface IHandleImage
{
    bool Base64StringControl(string img);
    IFormFile? Base64ToIFormFile(string base64string, string name);
}
