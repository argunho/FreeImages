using FreeImages.Intefaces;

namespace FreeImages.Repository;

public class HandleImage : IHandleImage
{
    public IFormFile? Base64ToIFormFile(string base64string, string name)
    {
        if (base64string == null || name == null)
            return null;
        try
        {
            var str = base64string[(base64string.IndexOf(",") + 1)..];
            byte[] bytes = Convert.FromBase64String(str);
            MemoryStream stream = new(bytes);

            return new FormFile(stream, 0, bytes.Length, "image/jpeg", name)
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg"
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return null;
        }
    }

    public bool Base64StringControl(string imgString)
    {
        Span<byte> bytes = new(new byte[imgString.Length]);
        return Convert.TryFromBase64String(imgString[(imgString.IndexOf(",") + 1)..], bytes, out int _);
    }


}
