﻿using FreeImages.Data;
using FreeImages.Intefaces;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Text.RegularExpressions;

namespace FreeImages.Repository;

public class HelpFunctions : IHelpFunctions
{
    private DbConnect _db;
    private string? _message { get; set; }

    public HelpFunctions(DbConnect db)
    {
        _db = db;
    }

    // Delete data
    public bool Delete(int id)
    {
        return true;
    }

    // Save new or changed data
    public bool Save()
    {
        try
        {
            _message = "It was successfully!";
            return _db.SaveChanges() > -1;
        }
        catch (Exception ex)
        {
            _message = "Failed. Something has gone wrong. \nError: " + ex.Message;
            return false;
        }
    }

    // Return response
    public JsonResult Response(string? result, string? msg = null) => new JsonResult(new { result = result, msg = msg ?? _message });

    // Check email
    public bool CheckEmail(string email)
    {
        Regex regex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");
        Match match = regex.Match(email);

        return (match.Success) ? true : false;
    }

    // Return hash
    public string Hash(int count = 0)
    {
        var hash = Guid.NewGuid().ToString();

        return hash.Substring(0, count).Replace("-", "");
    }

    // Return date
    public DateTime DateFromString(string date)
    {
        var culture = new CultureInfo("sv-SE");
        return DateTime.Parse(date, culture);
    }

    // Return bad request
    public Response BadResponse(string? message)  => 
        new Models.Response { Alert = "error", Message = $"Something went wrong while trying to register a new user.!\n {message}" };
}
