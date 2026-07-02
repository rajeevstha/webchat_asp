using Microsoft.AspNetCore.Identity;
using Webchat.Application.Dtos.Messages;
using Webchat.Application.Interfaces;
using Webchat.Application.Repository;
using Webchat.Domain.Entities;

namespace Webchat.Infrastructure.Services;

public class MessageService : IMessageService
{
    private readonly IMessageRepository _messageRepository;
    private readonly IConversationRepository _conversationRepository;
    private readonly UserManager<User> _userManager;

    public MessageService(
        IMessageRepository messageRepository,
        IConversationRepository conversationRepository,
        UserManager<User> userManager)
    {
        _messageRepository = messageRepository;
        _conversationRepository = conversationRepository;
        _userManager = userManager;
    }

    public async Task<MessageDto> SendMessageAsync(
        Guid senderId,
        Guid receiverId,
        string content)
    {
        var sender = await _userManager.FindByIdAsync(senderId.ToString())
            ?? throw new Exception("Sender not found");

        var receiver = await _userManager.FindByIdAsync(receiverId.ToString())
            ?? throw new Exception("Receiver not found");

        var conversation = await _conversationRepository
            .GetPrivateConversationAsync(senderId, receiverId);

        if (conversation == null)
        {
            conversation = new Conversation();

            conversation.Participants.Add(new ConversationParticipant
            {
                UserId = senderId
            });

            conversation.Participants.Add(new ConversationParticipant
            {
                UserId = receiverId
            });

            await _conversationRepository.AddAsync(conversation);
        }

        var message = new Message
        {
            ConversationId = conversation.Id,
            SenderId = senderId,
            Content = content,
            SentAt = DateTime.UtcNow
        };

        await _messageRepository.AddAsync(message);

        return new MessageDto
        {
            Id = message.Id,
            ConversationId = conversation.Id,
            SenderId = senderId,
            Content = content,
            SentAt = message.SentAt
        };
    }

    public async Task<List<MessageDto>> GetConversationAsync(
        Guid userId,
        Guid otherUserId)
    {
        var conversation = await _conversationRepository
            .GetPrivateConversationAsync(userId, otherUserId);

        if (conversation == null)
            return new();

        var messages = await _messageRepository.GetConversationMessagesAsync(
                        conversation.Id,
                        1,      // page
                        100);

        return messages.Select(m => new MessageDto
        {
            Id = m.Id,
            ConversationId = m.ConversationId,
            SenderId = m.SenderId,
            Content = m.Content,
            SentAt = m.SentAt,
        }).ToList();
    }

    public async Task<MessageDto?> GetMessageByIdAsync(Guid messageId)
    {
        var message = await _messageRepository.GetByIdAsync(messageId);

        if (message == null)
            return null;

        return new MessageDto
        {
            Id = message.Id,
            ConversationId = message.ConversationId,
            SenderId = message.SenderId,
            Content = message.Content,
            SentAt = message.SentAt,
        };
    }

    public async Task MarkAsSeenAsync(
        Guid messageId,
        Guid userId)
    {
        var message = await _messageRepository.GetByIdAsync(messageId);

        if (message == null)
            throw new Exception("Message not found");

        if (message.SenderId == userId)
            throw new Exception("Sender cannot mark own message as seen");

        await _messageRepository.UpdateAsync(message);
    }
}