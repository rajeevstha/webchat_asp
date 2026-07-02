using Webchat.Domain.Entities;

namespace Webchat.Application.Repository;

public interface IMessageRepository
{
    // Create
    Task AddAsync(Message message);

    // Read
    Task<Message?> GetByIdAsync(Guid messageId);

    Task<IEnumerable<Message>> GetConversationMessagesAsync(
        Guid conversationId,
        int page,
        int pageSize);

    Task<Message?> GetLastMessageAsync(
        Guid conversationId);

    Task<int> GetUnreadCountAsync(
        Guid conversationId,
        Guid userId);

    // Update
    Task UpdateAsync(Message message);
}