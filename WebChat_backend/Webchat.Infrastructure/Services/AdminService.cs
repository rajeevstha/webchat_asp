using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Webchat.Application.Dtos.Admin;
using Webchat.Application.Dtos.Users;
using Webchat.Application.Interfaces;
using Webchat.Domain.Entities;
using Webchat.Domain.Enums;


namespace Webchat.Infrastructure.Services;

public class AdminService : IAdminService
{
    private readonly UserManager<User> _userManager;

    public AdminService(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = await _userManager.Users.ToListAsync();

        return users.Select(MapToDto);
    }

    public async Task<UserDto?> GetUserByIdAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());

        return user == null ? null : MapToDto(user);
    }

    public async Task<UserDto> CreateUserAsync(CreateUserRequestAdmin request)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);

        if (existingUser != null)
            throw new InvalidOperationException("Email already exists.");

        var user = new User
        {
            UserName = request.Email,
            Email = request.Email,
            DisplayName = request.Name,
            IsOnline = false,
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
            throw new Exception(string.Join(
                Environment.NewLine,
                result.Errors.Select(e => e.Description)));

        await _userManager.AddToRoleAsync(
            user,
            UserRole.User.ToString());

        return MapToDto(user);
    }

    public async Task<UserDto> UpdateUserAsync(
        Guid userId,
        UpdateUserRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new KeyNotFoundException("User not found.");

        user.DisplayName = request.Name;
        user.Email = request.Email;
        user.UserName = request.Email;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
            throw new Exception(string.Join(
                Environment.NewLine,
                result.Errors.Select(e => e.Description)));

        // Update role
        var roles = await _userManager.GetRolesAsync(user);

        await _userManager.RemoveFromRolesAsync(user, roles);

        await _userManager.AddToRoleAsync(
            user,
            request.Role.ToString());

        return MapToDto(user);
    }

    public async Task DeleteUserAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new KeyNotFoundException("User not found.");

        var result = await _userManager.DeleteAsync(user);

        if (!result.Succeeded)
            throw new Exception(string.Join(
                Environment.NewLine,
                result.Errors.Select(e => e.Description)));
    }

    public async Task BlockUserAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new KeyNotFoundException("User not found.");

        user.IsBlocked = true;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
            throw new Exception(string.Join(
                Environment.NewLine,
                result.Errors.Select(e => e.Description)));
    }

    public async Task UnblockUserAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new KeyNotFoundException("User not found.");

        user.IsBlocked = false;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
            throw new Exception(string.Join(
                Environment.NewLine,
                result.Errors.Select(e => e.Description)));
    }

    private static UserDto MapToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Name = user.DisplayName,
            Email = user.Email!,
            IsOnline = user.IsOnline,
            IsBlocked = user.IsBlocked,
            CreatedAt = user.CreatedAt,
        };
    }
}