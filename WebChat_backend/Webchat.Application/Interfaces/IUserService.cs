using System;
using System.Collections.Generic;
using System.Text;
using Webchat.Application.Dtos.Users;

namespace Webchat.Application.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetUsersAsync(Guid currentUserId);

        Task DeleteAsync(Guid id);
    }
}
