using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FreeImages.Migrations
{
    /// <inheritdoc />
    public partial class updatetables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Height",
                table: "ListImages");

            migrationBuilder.DropColumn(
                name: "Width",
                table: "ListImages");

            migrationBuilder.AddColumn<int>(
                name: "Height",
                table: "Images",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Width",
                table: "Images",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Height",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "Width",
                table: "Images");

            migrationBuilder.AddColumn<int>(
                name: "Height",
                table: "ListImages",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Width",
                table: "ListImages",
                type: "int",
                nullable: true);
        }
    }
}
