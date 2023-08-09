using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Net.Mail;

namespace FreeImages.Repository;

public class MailRepository
{
    // Service params
    private readonly string _smtpString = "mail.hobbykitchen.com";
    private readonly string _emailString = "";
    private readonly string _passwordString = "_";
    private readonly string _logoString = "Free Images";

    // Template params
    public static string mailContent = "<div style='width:98%;overflow:hidden;display:block;border:2px solid #3B8506;margin:auto;background:#FFFFFF;font-family:Tahoma;'>" +
                                        "<div style='width:100%;height:140px;display:block;position:relative;'>" +
                                        "<a href='{link}' style='width:100%;display:block:height:auto;' target='_blank'>" +
                                        "<p style='width:90%;max-width:400px;height:120px;margin:10px auto;font-size:30px'>{logo}</p></a></div>" +
                                        "<div style='width:auto;padding:20px;font-size:18px;display:block;'>{content}</div>" +
                                        "<div style='width:96%;margin:20px 1%;display:block;padding:25px 1%;text-align:center;line-height:25px;" +
                                        "font-size:16px;border-top:2px solid #3B8506;'><div style='width:50%;min-width:320px;display:block;margin:auto;font-family:Franklin Gothic Medium;'>{footer}</div></div></div>";

    //<img src='{logo}' alt='' style='width:90%;max-width:400px;height:120px;margin:10px auto;' />
    public static string? _message { get; set; }


    // Send mail service
    public bool SendMail(string toEmail, string subject, string content, string footer = "")
    {
        try
        {
            var logo = ImageToBase64(@"wwwroot/logo.png");
            MailMessage _mail = new(new MailAddress("no-reply@freipictures.club", "Free Pictures"), new MailAddress(toEmail));
            _mail.Subject = subject;
            _mail.Body = mailContent.Replace("{content}", content).Replace("{footer}", footer).Replace("{logo}", logo);
            _mail.IsBodyHtml = true;

            SmtpClient _smtp = new();
            _smtp.Host = _smtpString;
            _smtp.Port = 25;
            _smtp.EnableSsl = false;
            _smtp.DeliveryMethod = SmtpDeliveryMethod.Network;

            NetworkCredential credential = new NetworkCredential();
            credential.UserName = _emailString;
            credential.Password = _passwordString;
            _smtp.UseDefaultCredentials = false;
            _smtp.Credentials = credential;

            _smtp.Send(_mail);
            return true;
        }
        catch (Exception ex)
        {
            Debug.WriteLine(ex.Message);
            _message = ex.Message;
            return false;
        }
    }

    // Send mail service
    public bool SendMailWithFile(string toEmail, string mailSubject, string mailContent, string emailFrom, string password, IFormFile? attachedFile = null)
    {
        try
        {
            var logo = ImageToBase64(@"wwwroot/logo.png");
            MailMessage _mail = new MailMessage(new MailAddress("no-reply@freeimages", "Free Images"), new MailAddress(toEmail));
            _mail.Subject = mailSubject;
            _mail.Body = mailContent.Replace("{content}", mailContent).Replace("{logo}", logo);
            _mail.IsBodyHtml = true;
            if (attachedFile != null)
            {
                _mail.Attachments.Add(new Attachment(attachedFile.OpenReadStream(), mailSubject + "."
                        + attachedFile.ContentType.Substring(attachedFile.ContentType.IndexOf("/") + 1)));
            }

            SmtpClient _smtp = new SmtpClient();
            _smtp.Host = _smtpString;
            _smtp.Port = 25;
            _smtp.EnableSsl = false;
            _smtp.DeliveryMethod = SmtpDeliveryMethod.Network;

            NetworkCredential credential = new NetworkCredential();
            credential.UserName = emailFrom;
            credential.Password = password;
            _smtp.UseDefaultCredentials = false;
            _smtp.Credentials = credential;

            _smtp.Send(_mail);
            return true;
        }
        catch (Exception ex)
        {
            Debug.WriteLine(ex.Message);
            _message = ex.Message;
            return false;
        }
    }

    public bool SendEmail(string mailTo, string subject, string content, string footer = "") // Email sending without user's email credentials
    {
        try
        {
            //var logo = ImageToBase64(@"wwwroot/logo.png");
            
            MailMessage _mail = new(new MailAddress("info@freeimages.online", "Free Images"), new MailAddress(mailTo));
            SmtpClient _smtp = new(_smtpString);
            _mail.Subject = subject;
            _mail.Body = mailContent.Replace("{content}", content).Replace("{footer}", footer).Replace("{logo}", _logoString);
            _mail.IsBodyHtml = true;
            _smtp.Send(_mail);
            return true;
        }
        catch (Exception ex)
        {
            Debug.WriteLine(ex.Message);
            _message = ex.Message;
            return false;
        }
    }

    #region Help methods
    public string ImageToBase64(string imgUrl = "")
    {
        string imgBase64 = "";
        using (System.Drawing.Image img = System.Drawing.Image.FromFile(imgUrl))
        {
            using (MemoryStream m = new MemoryStream())
            {
                System.Drawing.Image imageToConvert = img;
                imageToConvert.Save(m, img.RawFormat);
                byte[] imageBytes = m.ToArray();
                imgBase64 = Convert.ToBase64String(imageBytes);
            }
        }
        return imgBase64;
    }
    #endregion
}
