using System;
using System.Collections.Generic;
using System.Text;

namespace Webchat.Domain.Entities
{
    public class Conversation
    {
        public Guid Id { get; init; } = Guid.NewGuid();
        public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
        public DateTime LastActivityAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<Message> Messages { get; set; } = new List<Message>();
        public ICollection<ConversationParticipant> Participants { get; set; } = new List<ConversationParticipant>();
    }
}
