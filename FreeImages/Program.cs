global using FreeImages.Data;
global using FreeImages.Intefaces;
global using System.Text;
global using FreeImages.Repository;
global using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

#region Customized change
// Add services to the container.
ConfigurationManager configuration = builder.Configuration;

builder.Services.AddDbContext<DbConnect>(options => options.UseSqlServer(
             configuration.GetConnectionString("DbConnection")));

// Add interfaces and repositories --- 
builder.Services.AddScoped<IHandleImage, HandleImage>();
builder.Services.AddScoped<IHelpFunctions, HelpFunctions>();


// Authennticatio with Jwt ---
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["FreeImagesJwt:Key"])),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});
#endregion

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

#region Customized change
app.UseAuthentication(); // ---
app.UseAuthorization(); // ---

// Authorization with Jwt ---
app.UseCors(builder => builder.WithOrigins(configuration["FreeImagesJwt:Url"])
                                .AllowAnyHeader().AllowAnyMethod());
#endregion

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
