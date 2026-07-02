using Webchat.Application.DTOs;

namespace Webchat.Application.Interfaces;

public interface IConversationService
{
    Task<ConversationDto> CreateConversationAsync(
        Guid creatorId,
        IEnumerable<Guid> participantIds);

    Task<IEnumerable<ConversationDto>> GetUserConversationsAsync(
        Guid userId);

    Task<ConversationDto?> GetConversationByIdAsync(
        Guid conversationId,
        Guid userId);

    Task<bool> ConversationExistsAsync(
        Guid conversationId);

    Task<bool> IsParticipantAsync(
        Guid conversationId,
        Guid userId);
}