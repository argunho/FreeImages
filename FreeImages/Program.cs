using FreeImages.Data;
using FreeImages.Intefaces;
using FreeImages.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
ConfigurationManager configuration = builder.Configuration;

builder.Services.AddDbContext<FreeImagesDbConnect>(options => options.UseSqlServer(
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


// Add services to the container ---
builder.Services.AddControllers();

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

app.UseAuthentication(); // ---
app.UseAuthorization(); // ---

// Authorization with Jwt ---
app.UseCors(builder => builder.WithOrigins(configuration["FreeImagesJwt:Url"])
                                .AllowAnyHeader().AllowAnyMethod());


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
