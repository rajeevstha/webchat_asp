using Microsoft.EntityFrameworkCore;
using Webchat.Application.Repository;
using Webchat.Domain.Entities;
using Webchat.Infrastructure.Data;

namespace Webchat.Infrastructure.Repository;

public class MessageRepository : IMessageRepository
{
    private readonly WebChatDbContext _context;

    public MessageRepository(WebChatDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Message message)
    {
        await _context.Messages.AddAsync(message);
        await _context.SaveChangesAsync();
    }

    public async Task<Message?> GetByIdAsync(Guid messageId)
    {
        return await _context.Messages
            .Include(m => m.Sender)
            .FirstOrDefaultAsync(m => m.Id == messageId);
    }

    public async Task<IEnumerable<Message>> GetConversationMessagesAsync(
        Guid conversationId,
        int page,
        int pageSize)
    {
        return await _context.Messages
            .Where(m => m.ConversationId == conversationId)
            .OrderBy(m => m.SentAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<Message?> GetLastMessageAsync(
        Guid conversationId)
    {
        return await _context.Messages
            .Where(m => m.ConversationId == conversationId)
            .OrderByDescending(m => m.SentAt)
            .FirstOrDefaultAsync();
    }

    public async Task<int> GetUnreadCountAsync(
        Guid conversationId,
        Guid userId)
    {
        return await _context.Messages
            .CountAsync(m =>
                m.ConversationId == conversationId &&
                m.SenderId != userId);
    }

    public async Task UpdateAsync(Message message)
    {
        _context.Messages.Update(message);
        await _context.SaveChangesAsync();
    }
}