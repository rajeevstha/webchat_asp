using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Webchat.Domain.Entities;

namespace Webchat.Infrastructure.Data.Configurations;
public class ConversationParticipantConfiguration
    : IEntityTypeConfiguration<ConversationParticipant>
{
    public void Configure(EntityTypeBuilder<ConversationParticipant> builder)
    {
        builder.HasKey(cp => new
        {
            cp.ConversationId,
            cp.UserId
        });

        builder.Property(cp => cp.JoinedAt)
               .IsRequired();

        builder.HasOne(cp => cp.Conversation)
               .WithMany(c => c.Participants)
               .HasForeignKey(cp => cp.ConversationId);

        builder.HasOne(cp => cp.User)
               .WithMany(u => u.ConversationParticipants)
               .HasForeignKey(cp => cp.UserId);
    }
}