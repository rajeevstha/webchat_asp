using Webchat.Domain.Enums;

namespace Webchat.Domain.Entities
{
    public class Message
    {
        public Guid Id { get; init; } = Guid.NewGuid();
        public Guid ConversationId { get; init; }
        public Guid SenderId { get; init; }
        public string Content { get; set; } = string.Empty;
        public bool IsBroadcast { get; set; }
        
        public MessageStatus Status { get; set; } = MessageStatus.Sent;
        public DateTime SentAt { get; init; } = DateTime.UtcNow;

        // Navigation
        public User? Sender { get; set; }
        public Conversation? Conversation { get; set; }
    }
}
