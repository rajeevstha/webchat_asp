using System;
using System.Collections.Generic;
using System.Text;

namespace Webchat.Application.DTOs
{
    public sealed class ConversationDto
    {
        public Guid Id { get; init; }

        public string Name { get; init; } = string.Empty;

        public DateTime CreatedAt { get; init; }

        public int ParticipantCount { get; init; }

        public string? LastMessage { get; init; }
    }
}
