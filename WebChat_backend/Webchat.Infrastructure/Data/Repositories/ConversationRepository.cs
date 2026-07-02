using Microsoft.EntityFrameworkCore;
using Webchat.Application.Repository;
using Webchat.Domain.Entities;
using Webchat.Infrastructure.Data;

namespace Webchat.Infrastructure.Repository;

public sealed class ConversationRepository : IConversationRepository
{
    private readonly WebChatDbContext _context;

    public ConversationRepository(WebChatDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Conversation conversation)
    {
        await _context.Conversations.AddAsync(conversation);
        await _context.SaveChangesAsync();
    }

    public async Task<Conversation?> GetByIdAsync(Guid conversationId)
    {
        return await _context.Conversations
            .Include(c => c.Participants)
            .Include(c => c.Messages)
            .FirstOrDefaultAsync(c => c.Id == conversationId);
    }

    public async Task<IEnumerable<Conversation>> GetUserConversationsAsync(
        Guid userId)
    {
        return await _context.Conversations
            .Include(c => c.Participants)
            .Include(c => c.Messages)
            .Where(c => c.Participants.Any(p => p.UserId == userId))
            .OrderByDescending(c => c.LastActivityAt)
            .ToListAsync();
    }

    public async Task<bool> ExistsAsync(Guid conversationId)
    {
        return await _context.Conversations
            .AnyAsync(c => c.Id == conversationId);
    }

    public async Task<bool> IsParticipantAsync(
        Guid conversationId,
        Guid userId)
    {
        return await _context.Conversations
            .AnyAsync(c =>
                c.Id == conversationId &&
                c.Participants.Any(p => p.UserId == userId));
    }

    public async Task<Conversation?> GetPrivateConversationAsync(
    Guid user1Id,
    Guid user2Id)
    {
        return await _context.Conversations
            .Include(c => c.Participants)
            .Include(c => c.Messages)
            .FirstOrDefaultAsync(c =>
                c.Participants.Count == 2 &&
                c.Participants.Any(p => p.UserId == user1Id) &&
                c.Participants.Any(p => p.UserId == user2Id));
    }

    public async Task UpdateAsync(Conversation conversation)
    {
        _context.Conversations.Update(conversation);
        await _context.SaveChangesAsync();
    }
}