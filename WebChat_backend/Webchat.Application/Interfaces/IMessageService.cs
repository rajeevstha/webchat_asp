using Webchat.Application.Dtos.Messages;

namespace Webchat.Application.Interfaces
{
    public interface IMessageService
    {
        // Send a new message
        Task<MessageDto> SendMessageAsync(
            Guid senderId,
            Guid receiverId,
            string content);

        // Get the conversation history between two users
        Task<List<MessageDto>> GetConversationAsync(
            Guid userId,
            Guid otherUserId);

        // Get a single message
        Task<MessageDto?> GetMessageByIdAsync(
            Guid messageId);


        // Mark a message as seen
        Task MarkAsSeenAsync(
            Guid messageId,
            Guid userId);

        Task MarkAsDeliveredAsync(Guid messageId);

        Task<Dictionary<Guid, int>> GetUnreadCountsAsync(Guid currentUserId);


    }
}
