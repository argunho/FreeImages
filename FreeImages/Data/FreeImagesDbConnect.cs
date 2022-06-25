using FreeImages.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FreeImages.Data;
public class FreeImagesDbConnect : IdentityDbContext<User>
{
    public FreeImagesDbConnect(DbContextOptions<FreeImagesDbConnect> options) : base(options) { }

    public DbSet<ImageData>? ImageData { get; set; }
    public DbSet<UploadedImage>? UploadedImages { get; set; }
    public DbSet<User>? User { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        //seed roles
        modelBuilder.Entity<IdentityRole>().HasData(
                new IdentityRole { Name = "Admin", NormalizedName = "ADMIN" },
                new IdentityRole { Name = "Support", NormalizedName = "SUPPORT" }
            );
    }
}

