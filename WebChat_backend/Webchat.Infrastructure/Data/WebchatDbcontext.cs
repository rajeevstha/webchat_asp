using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Webchat.Domain.Entities;
using WebChat.Domain.Entities;

namespace Webchat.Infrastructure.Data;

public class WebChatDbContext
    : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public WebChatDbContext(DbContextOptions<WebChatDbContext> options)
        : base(options)
    {
    }

    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Conversation> Conversations => Set<Conversation>();

    public DbSet<Message> Messages => Set<Message>();

    public DbSet<ConversationParticipant> ConversationParticipants
        => Set<ConversationParticipant>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<RefreshToken>()
        .ToTable("RefreshToken");

        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(WebChatDbContext).Assembly);
    }
}