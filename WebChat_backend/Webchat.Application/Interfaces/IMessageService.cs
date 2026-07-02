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

        // Edit a message
        //Task EditMessageAsync(
        //    Guid messageId,
        //    Guid userId,
        //    string newContent);

        // Delete a message
        //Task DeleteMessageAsync(
        //    Guid messageId,
        //    Guid userId);

        // Mark a message as seen
        Task MarkAsSeenAsync(
            Guid messageId,
            Guid userId);
    }
}
