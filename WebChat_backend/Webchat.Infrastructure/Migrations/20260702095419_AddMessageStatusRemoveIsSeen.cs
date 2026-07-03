using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Webchat.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMessageStatusRemoveIsSeen : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSeenByReceiver",
                table: "Messages");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Messages",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Messages");

            migrationBuilder.AddColumn<bool>(
                name: "IsSeenByReceiver",
                table: "Messages",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
