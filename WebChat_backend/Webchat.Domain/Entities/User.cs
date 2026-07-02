using Microsoft.AspNetCore.Identity;
using Webchat.Domain.Enums;

namespace Webchat.Domain.Entities;

public class User : IdentityUser<Guid>
{
    public string? DisplayName { get; set; }

    public bool IsOnline { get; set; }

    //public UserRole Role { get; set; } = UserRole.User;

    public string? RefreshToken { get; set; }

    public DateTime? RefreshTokenExpiresAt { get; set; }

    public DateTime LastSeenAt { get; set; }

    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;

    // Navigation
    public ICollection<Message> Messages { get; set; }
        = new List<Message>();

    public ICollection<ConversationParticipant> ConversationParticipants { get; set; }
        = new List<ConversationParticipant>();
}