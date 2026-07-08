using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Webchat.Application.Interfaces;

namespace Webchat.Api.Endpoints;

public static class MessageEndpoints
{
    public static void MapMessageEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/messages")
            .RequireAuthorization();

        group.MapGet("/{userId:guid}",
            async (
                Guid userId,
                ClaimsPrincipal user,
                IMessageService messageService) =>
            {
                var currentUserId = Guid.Parse(
                    user.FindFirstValue(ClaimTypes.NameIdentifier)!);

                var messages = await messageService.GetConversationAsync(
                    currentUserId,
                    userId);

                return Results.Ok(messages);
        });

        app.MapGet("/api/messages/unread-counts",
        async (
            ClaimsPrincipal user,
            IMessageService messageService) =>
            {
            var userId = Guid.Parse(
                user.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var counts = await messageService.GetUnreadCountsAsync(userId);

            return Results.Ok(counts);
            })
        .RequireAuthorization();
        }
}