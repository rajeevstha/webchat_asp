using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Webchat.Application.Interfaces;

namespace Webchat.Api.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly IMessageService _messageService;

    public ChatHub(IMessageService messageService)
    {
        _messageService = messageService;
    }

    public override async Task OnConnectedAsync()
    {
        Console.WriteLine("ChatHub connected");
        Console.WriteLine($"{Context.UserIdentifier} connected");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine($"{Context.UserIdentifier} disconnected");
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
}