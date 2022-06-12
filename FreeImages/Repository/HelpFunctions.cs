using FreeImages.Data;
using FreeImages.Intefaces;
using Microsoft.AspNetCore.Mvc;

namespace FreeImages.Repository;

public class HelpFunctions : IHelpFunctions
{
    private FreeImagesDbConnect _db;
    private string? _message { get; set; }

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
            _message = "It was successfully!";
            return _db.SaveChanges() > -1;
        }
        catch (Exception ex)
        {
            _message = ex.Message;
            return false;
        }
    }

    public JsonResult Response(string? result, string? msg = null) => new JsonResult(new { result = result, msg = msg ?? _message });
}
