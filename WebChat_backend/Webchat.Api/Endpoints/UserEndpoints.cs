using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Webchat.Application.Interfaces;

namespace Webchat.Api.Endpoints;

public static class UserEndpoints
{
    public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users")
            .RequireAuthorization();

        group.MapGet("/", async (
            ClaimsPrincipal user,
            IUserService userService) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
                return Results.Unauthorized();

            var users = await userService.GetUsersAsync(Guid.Parse(userId));

            return Results.Ok(users);
        });

        group.MapDelete("/{id:guid}",
        async (
            Guid id,
            IUserService userService) =>
        {
            await userService.DeleteAsync(id);
            return Results.NoContent();
        })
    .RequireAuthorization(new AuthorizeAttribute
    {
        Roles = "Admin"
    });

        return app;
    }
}