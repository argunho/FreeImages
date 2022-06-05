using Microsoft.AspNetCore.Mvc;

namespace FreeImages.Intefaces;

public interface IHelpFunctions
{
    JsonResult Error(string? error = "");
    JsonResult Success();
    bool Save();
    bool Delete(int id);
}
