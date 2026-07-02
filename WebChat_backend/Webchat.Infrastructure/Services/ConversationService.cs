using Webchat.Application.DTOs;
using Webchat.Application.Interfaces;
using Webchat.Application.Repository;
using Webchat.Domain.Entities;

namespace Webchat.Infrastructure.Services;

public class ConversationService : IConversationService
{
    private readonly IConversationRepository _conversationRepository;

    public ConversationService(
        IConversationRepository conversationRepository)
    {
        _conversationRepository = conversationRepository;
    }

    public async Task<ConversationDto> CreateConversationAsync(
        Guid creatorId,
        IEnumerable<Guid> participantIds)
    {
        var participants = participantIds
            .Distinct()
            .ToList();

        if (!participants.Contains(creatorId))
            participants.Add(creatorId);

        var conversation = new Conversation
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            Participants = participants.Select(id =>
                new ConversationParticipant
                {
                    UserId = id
                }).ToList()
        };

        await _conversationRepository.AddAsync(conversation);

        return new ConversationDto
        {
            Id = conversation.Id,
            CreatedAt = conversation.CreatedAt,
        };
    }

    public async Task<IEnumerable<ConversationDto>>
        GetUserConversationsAsync(Guid userId)
    {
        var conversations =
            await _conversationRepository
                .GetUserConversationsAsync(userId);

        return conversations.Select(c => new ConversationDto
        {
            Id = c.Id,
            CreatedAt = c.CreatedAt
        });
    }

    public async Task<ConversationDto?>
        GetConversationByIdAsync(
            Guid conversationId,
            Guid userId)
    {
        var conversation =
            await _conversationRepository
                .GetByIdAsync(conversationId);

        if (conversation == null)
            return null;

        var isParticipant = conversation.Participants
            .Any(p => p.UserId == userId);

        if (!isParticipant)
            return null;

        return new ConversationDto
        {
            Id = conversation.Id,
            CreatedAt = conversation.CreatedAt,
        };
    }

    public async Task<bool> ConversationExistsAsync(
        Guid conversationId)
    {
        return await _conversationRepository
            .ExistsAsync(conversationId);
    }

    public async Task<bool> IsParticipantAsync(
        Guid conversationId,
        Guid userId)
    {
        return await _conversationRepository
            .IsParticipantAsync(
                conversationId,
                userId);
    }
}