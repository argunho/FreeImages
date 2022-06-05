using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FreeImages.Migrations
{
    public partial class update : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Img",
                table: "UploadedImages");

            migrationBuilder.RenameColumn(
                name: "Text",
                table: "UploadedImages",
                newName: "ImgType");

            migrationBuilder.AddColumn<string>(
                name: "Author",
                table: "UploadedImages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "UploadedImages",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Author",
                table: "UploadedImages");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "UploadedImages");

            migrationBuilder.RenameColumn(
                name: "ImgType",
                table: "UploadedImages",
                newName: "Text");

            migrationBuilder.AddColumn<string>(
                name: "Img",
                table: "UploadedImages",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
