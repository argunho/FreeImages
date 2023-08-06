global using FreeImages.Models;

namespace FreeImages.Data;
public class DbConnect : DbContext
{
    public DbConnect(DbContextOptions<DbConnect> options) : base(options) { }

    public DbSet<Image>? Image => Set<Image>();
    public DbSet<ListImage>? ListImages => Set<ListImage>();
    public DbSet<Values> Values => Set<Values>();
    public DbSet<Visits> Visits => Set<Visits>();
    public DbSet<User>? User => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed roles
        //modelBuilder.Entity<IdentityRole>().HasData(
        //        new IdentityRole { Name = "Admin", NormalizedName = "ADMIN" },
        //        new IdentityRole { Name = "Support", NormalizedName = "SUPPORT" },
        //        new IdentityRole { Name = "User", NormalizedName = "USER" }
        //    );

        // Make keyless
        //modelBuilder.Entity<User>(u => { u.HasNoKey(); });
    }
}

