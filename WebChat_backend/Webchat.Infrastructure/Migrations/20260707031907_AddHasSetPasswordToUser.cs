using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Webchat.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddHasSetPasswordToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HasSetPassword",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasSetPassword",
                table: "AspNetUsers");
        }
    }
}
