using Microsoft.AspNetCore.Mvc;

namespace FreeImages.Intefaces;

public interface IHelpFunctions
{
    JsonResult Response(string? result, string? msg = null);
    bool Save();
    bool Delete(int id);
    bool CheckEmail(string email);
}
