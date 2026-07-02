using System;
using System.Collections.Generic;
using System.Text;

namespace Webchat.Domain.Entities
{
    public class ConversationParticipant
    {
        public Guid ConversationId { get; init; }
        public Guid UserId { get; init; }
        public DateTime JoinedAt { get; init; } = DateTime.UtcNow;

        // Navigation
        public Conversation? Conversation { get; set; }
        public User? User { get; set; }
    }
}
