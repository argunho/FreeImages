using FreeImages.Data;
using FreeImages.Intefaces;
using Microsoft.AspNetCore.Mvc;

namespace FreeImages.Repository;

public class HelpFunctions : IHelpFunctions
{
    private FreeImagesDbConnect _db;
    private string? _error { get; set; }

    public HelpFunctions(FreeImagesDbConnect db)
    {
        _db = db;
    }

    public bool Delete(int id)
    {
        return true;
    }

    public bool Save()
    {
        try
        {
            return _db.SaveChanges() > 1;
        }
        catch (Exception ex)
        {
            _error = ex.Message;
            return false;
        }
    }

    public JsonResult Error(string? error = null) => new JsonResult(new { res = "error", msg = error ?? _error });
    public JsonResult Success() => new JsonResult(new { res = "success", msg = "It was successfully!" });

}
