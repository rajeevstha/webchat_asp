using System.Net.Http.Json;
using Microsoft.AspNetCore.SignalR.Client;
using Webchat.Application.Dtos.Auth;

Console.Write("Email: ");
string email = Console.ReadLine()!;

Console.Write("Password: ");
string password = Console.ReadLine()!;

using HttpClient httpClient = new();

var loginRequest = new LoginRequest
{
    Email = email,
    Password = password
};

var response = await httpClient.PostAsJsonAsync(
    "http://localhost:5107/api/auth/login",
    loginRequest);

if (!response.IsSuccessStatusCode)
{
    Console.WriteLine($"Login failed. Status Code: {response.StatusCode}");
    return;
}

var loginResponse =
    await response.Content.ReadFromJsonAsync<LoginResponse>();

if (loginResponse is null)
{
    Console.WriteLine("Invalid login response.");
    return;
}

string jwt = loginResponse.AccessToken;

Console.WriteLine("Login successful.");

var connection = new HubConnectionBuilder()
    .WithUrl("http://localhost:5107/chatHub", options =>
    {
        options.AccessTokenProvider = () => Task.FromResult(jwt)!;
    })
    .WithAutomaticReconnect()
    .Build();

connection.On<object>("ReceiveMessage", message =>
{
    Console.WriteLine($"\nReceived: {message}");
});

connection.Closed += error =>
{
    Console.WriteLine($"\nConnection Closed: {error?.Message}");
    return Task.CompletedTask;
};

connection.Reconnecting += error =>
{
    Console.WriteLine($"\nReconnecting: {error?.Message}");
    return Task.CompletedTask;
};

connection.Reconnected += connectionId =>
{
    Console.WriteLine($"\nReconnected. ConnectionId: {connectionId}");
    return Task.CompletedTask;
};

try
{
    await connection.StartAsync();
    Console.WriteLine($"Connected to ChatHub.");
    Console.WriteLine($"Connection State: {connection.State}");
}
catch (Exception ex)
{
    Console.WriteLine("Failed to connect to SignalR:");
    Console.WriteLine(ex);
    return;
}

Console.Write("Receiver User Id: ");
Guid receiverId = Guid.Parse(Console.ReadLine()!);

while (true)
{
    Console.Write("Message: ");

    string? message = Console.ReadLine();

    if (string.IsNullOrWhiteSpace(message))
        continue;

    Console.WriteLine($"Current Connection State: {connection.State}");

    if (connection.State != HubConnectionState.Connected)
    {
        Console.WriteLine("Cannot send message because the connection is not active.");
        continue;
    }

    try
    {
        await connection.InvokeAsync(
            "SendMessage",
            receiverId,
            message);

        Console.WriteLine("Message sent.");
    }
    catch (Exception ex)
    {
        Console.WriteLine("Error sending message:");
        Console.WriteLine(ex);
    }
}