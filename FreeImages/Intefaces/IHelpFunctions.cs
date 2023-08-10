using Microsoft.AspNetCore.Mvc;

namespace FreeImages.Intefaces;

public interface IHelpFunctions
{
    Task<bool> Save();
    bool CheckEmail(string email);
    string Hash(int count = 0);
    DateTime DateFromString(string data);
    JsonResult Response(string alert, string? msg = null);

}
