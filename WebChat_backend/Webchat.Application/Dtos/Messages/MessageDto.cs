using System;
using System.Collections.Generic;
using System.Text;

namespace Webchat.Application.Dtos.Messages
{
    public sealed class MessageDto
    {
        public Guid Id { get; init; }

        public Guid ConversationId { get; init; }

        public Guid SenderId { get; init; }

        public string SenderUsername { get; init; } = string.Empty;

        public string Content { get; init; } = string.Empty;

        public DateTime SentAt { get; init; }

        public bool IsSeen { get; init; }
    }
}
