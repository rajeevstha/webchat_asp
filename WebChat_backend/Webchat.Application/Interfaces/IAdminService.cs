using Webchat.Application.Dtos.Users;
using Webchat.Application.Dtos.Admin;


namespace Webchat.Application.Interfaces;

public interface IAdminService
{
    Task<IEnumerable<UserDto>> GetAllUsersAsync();

    Task<UserDto?> GetUserByIdAsync(Guid userId);

    Task<UserDto> CreateUserAsync(CreateUserRequestAdmin request);

    Task<UserDto> UpdateUserAsync(Guid userId, UpdateUserRequest request);

    Task DeleteUserAsync(Guid userId);

    Task BlockUserAsync(Guid userId);

    Task UnblockUserAsync(Guid userId);
}
