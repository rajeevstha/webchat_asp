using Webchat.Domain.Entities;

namespace Webchat.Application.Repository
{
    public interface IUserRepository : IRepository<User>
    {
        //Task<IEnumerable<Message>> GetConversationMessagesAsync(
        //    Guid conversationId,
        //    int page,
        //    int pageSize);

        //Task<Message?> GetLastMessageAsync(Guid conversationId);

        //Task<int> GetUnreadCountAsync(
        //    Guid conversationId,
        //    Guid userId);

        Task<IEnumerable<User>> GetAllExceptAsync(Guid currentUserId);
    }
}
