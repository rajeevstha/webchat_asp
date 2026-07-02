using System;
using System.Collections.Generic;
using System.Text;
using Webchat.Domain.Entities;

namespace Webchat.Application.Repository
{
    public interface IConversationParticipantRepository
    {
        Task<IEnumerable<ConversationParticipant>>
            GetParticipantsAsync(Guid conversationId);

        Task<ConversationParticipant?>
            GetParticipantAsync(Guid conversationId, Guid userId);

        Task RemoveParticipantAsync(
            Guid conversationId,
            Guid userId);
    }
}
