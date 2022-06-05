﻿using FreeImages.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FreeImages.Data;
public class FreeImagesDbConnect : IdentityDbContext<User>
{
    public FreeImagesDbConnect(DbContextOptions<FreeImagesDbConnect> options) : base(options) { }

    public DbSet<User>? User { get; set; }
    public DbSet<UploadedImage>? UploadedImages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}

