using Microsoft.AspNetCore.Mvc;

namespace FreeImages.Intefaces;

public interface IHelpFunctions
{
    JsonResult Response(string? result, string? msg = null);
    bool Save();
    bool Delete(int id);
    bool CheckEmail(string email);
    string Hash(int count = 0);
    DateTime DateFromString(string data);
    Response BadResponse(string? message);
}
