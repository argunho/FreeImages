using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FreeImages.Migrations
{
    /// <inheritdoc />
    public partial class uppdateUserClass : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserName",
                table: "User");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserName",
                table: "User",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
