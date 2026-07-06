using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using Webchat.Application.Interfaces;
using Webchat.Domain.Entities;

namespace Webchat.Api.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly IMessageService _messageService;
    private readonly UserManager<User> _userManager;

    public ChatHub(
        IMessageService messageService,
        UserManager<User> userManager
        )
    {
        _messageService = messageService;
        _userManager = userManager;
    }

    public override async Task OnConnectedAsync()
    {

        var userId = Guid.Parse(
        Context.User!.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var user = await _userManager.FindByIdAsync(userId.ToString());

        if (user != null)
        {
            user.IsOnline = true;
            await _userManager.UpdateAsync(user);

            await Clients.All.SendAsync(
           "UserStatusChanged",
           user.Id,
           true);
        }

        // Send current online users to the newly connected client
        var onlineUsers = _userManager.Users
            .Where(u => u.IsOnline)
            .Select(u => u.Id.ToString())
            .ToList();

        await Clients.Caller.SendAsync("OnlineUsers", onlineUsers);

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine($"{Context.UserIdentifier} disconnected");

        var userId = Guid.Parse(
       Context.User!.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var user = await _userManager.FindByIdAsync(userId.ToString());

        if (user != null)
        {
            user.IsOnline = false;
            await _userManager.UpdateAsync(user);

            await Clients.All.SendAsync(
            "UserStatusChanged",
            user.Id,
            false);
        }

        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(Guid receiverId, string content)
    {

        //Debug
        Console.WriteLine("===== SendMessage =====");
        Console.WriteLine($"Sender: {Context.UserIdentifier}");
        Console.WriteLine($"Receiver: {receiverId}");

        var senderId = Guid.Parse(
            Context.User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var message = await _messageService.SendMessageAsync(
            senderId,
            receiverId,
            content);

        //DEbug
        Console.WriteLine("Sending to receiver...");

        // Send to receiver
        await Clients.User(receiverId.ToString())
            .SendAsync("ReceiveMessage", message);

        Console.WriteLine("Sending to caller...");
        Console.WriteLine($"Message dispatched to user {receiverId}");

        // Echo back to sender
        await Clients.Caller
            .SendAsync("ReceiveMessage", message);
    }

    public async Task MessageDelivered(Guid messageId)
    {
        await _messageService.MarkAsDeliveredAsync(messageId);

        var message = await _messageService.GetMessageByIdAsync(messageId);

        if (message != null)
        {
            await Clients.User(message.SenderId.ToString())
                .SendAsync(
                    "MessageStatusUpdated",
                    message.Id,
                    message.Status);

        }
    }

    public async Task MessageSeen(Guid messageId)
    {

        var userId = Guid.Parse(
            Context.User!.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _messageService.MarkAsSeenAsync(messageId, userId);

        var message = await _messageService.GetMessageByIdAsync(messageId);

        if (message != null)
        {
            await Clients.User(message.SenderId.ToString())
                .SendAsync(
                    "MessageStatusUpdated",
                    message.Id,
                    message.Status);
        }
    }
}