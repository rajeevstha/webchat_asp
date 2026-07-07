using Webchat.Domain.Entities;
using Webchat.Application.Dtos.Auth;

namespace Webchat.Application.Interfaces;
public interface IAuthService
{
    Task<User> CreateUserAsync(string name, string email, string password);
    Task<LoginResponse> LoginAsync(string email, string password);
    Task<LoginResponse> RefreshTokenAsync(string refreshToken);
    Task LogoutAsync();

    Task ChangePasswordAsync(
      Guid userId,
      ChangePasswordRequest request);

    //Task ForgotPasswordAsync(
    //    ForgotPasswordRequest request);

    //Task ResetPasswordAsync(
    //    ResetPasswordRequest request);
}