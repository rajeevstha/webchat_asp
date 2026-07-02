using Microsoft.AspNetCore.Identity;
using Webchat.Application.Dtos.Users;
using Webchat.Application.Interfaces;
using Webchat.Application.Repository;
using Webchat.Domain.Entities;

namespace Webchat.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly UserManager<User> _userManager;
    public UserService(IUserRepository userRepository, UserManager<User> userManager)
    {
        _userRepository = userRepository;
        _userManager = userManager;
    }

    public async Task<IEnumerable<UserDto>> GetUsersAsync(Guid currentUserId)
    {
        var users = await _userRepository.GetAllExceptAsync(currentUserId);

        var result = new List<UserDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);

            result.Add(new UserDto
            {
                Id = user.Id,
                Name = user.UserName!,
                Email = user.Email!,
                IsOnline = user.IsOnline,
                Role = roles.FirstOrDefault() ?? "User"
            });
        }

        return result;
    }

    public async Task DeleteAsync(Guid id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());

        if (user == null)
            throw new Exception("User not found.");

        var result = await _userManager.DeleteAsync(user);

        if (!result.Succeeded)
            throw new Exception(
                string.Join(", ", result.Errors.Select(e => e.Description)));
    }
}