using Webchat.Domain.Entities;

namespace WebChat.Domain.Entities;

public class RefreshToken
{
    public Guid Id { get; private set; }

    public Guid UserId { get; private set; }

    public string TokenHash { get; private set; } = null!;

    public DateTime ExpiresAt { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public DateTime? RevokedAt { get; private set; }

    public virtual User User { get; private set; } = null!;

    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;

    public bool IsRevoked => RevokedAt != null;

    public bool IsActive => !IsExpired && !IsRevoked;

    private RefreshToken() { } // EF Core

    public RefreshToken(Guid userId, string tokenHash, DateTime expiresAt)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        TokenHash = tokenHash;
        CreatedAt = DateTime.UtcNow;
        ExpiresAt = expiresAt;
    }

    public void Revoke()
    {
        RevokedAt = DateTime.UtcNow;
    }
}