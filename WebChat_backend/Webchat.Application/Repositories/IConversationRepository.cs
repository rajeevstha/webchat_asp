using Webchat.Domain.Entities;

namespace Webchat.Application.Repository;

public interface IConversationRepository
{
    Task AddAsync(Conversation conversation);

    Task<Conversation?> GetByIdAsync(Guid conversationId);

    Task<IEnumerable<Conversation>> GetUserConversationsAsync(Guid userId);

    Task<bool> ExistsAsync(Guid conversationId);

    Task<bool> IsParticipantAsync(Guid conversationId, Guid userId);

    Task<Conversation?> GetPrivateConversationAsync(
        Guid user1Id,
        Guid user2Id);

    Task UpdateAsync(Conversation conversation);
}