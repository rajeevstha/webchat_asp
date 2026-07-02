using Webchat.Domain.Entities;

namespace Webchat.Application.Interfaces;

public interface IJwtService
{
    Task<string> GenerateTokenAsync(User user);
}
