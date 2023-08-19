using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FreeImages.Migrations
{
    /// <inheritdoc />
    public partial class addimagestables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Downloaded",
                table: "Images",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "View",
                table: "Images",
                type: "bigint",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Downloaded",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "View",
                table: "Images");
        }
    }
}
