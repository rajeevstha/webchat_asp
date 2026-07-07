using Microsoft.AspNetCore.Identity;
using Webchat.Domain.Entities;
using Webchat.Application.Interfaces;
using Webchat.Application.Dtos.Auth;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Http;
using System.Text;

namespace Webchat.Infrastructure.Services;
public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IJwtService _jwtService;
    private readonly IRefreshTokenService _refreshTokenService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private static string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }

    private static string Hash(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(bytes);
    }
    public AuthService(UserManager<User> userManager,
        SignInManager<User> signInManager,
        IJwtService jwtService,
        IRefreshTokenService refreshTokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtService = jwtService;
        _refreshTokenService = refreshTokenService;
    }
    public async Task<User> CreateUserAsync(string name, string email, string password)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new Exception("Name cannot be empty");
        
        if (string.IsNullOrWhiteSpace(email))
            throw new Exception("Email cannot be empty");

        if (string.IsNullOrWhiteSpace(password))
            throw new Exception("Password cannot be empty");

        var existing = await _userManager.FindByEmailAsync(email);
        if (existing != null)
            throw new Exception("Email already exists");

        var user = new User
        {
            Email = email,
            UserName = name,
            IsOnline = false,
            HasSetPassword = true,
        };

        var result = await _userManager.CreateAsync(user, password);

        if (!result.Succeeded)
            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));

        return user;
    }

    public async Task<LoginResponse> LoginAsync(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null)
            throw new Exception("Invalid credentials");

        if (user.IsBlocked)
            throw new UnauthorizedAccessException(
                "Your account has been blocked. Please contact your administrator.");

        var result = await _signInManager.CheckPasswordSignInAsync(
            user,
            password,
            lockoutOnFailure: true);

        if (!result.Succeeded)
            throw new Exception("Invalid credentials");

        var accessToken = await _jwtService.GenerateTokenAsync(user);

        var refreshToken = GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(30);

        await _userManager.UpdateAsync(user);

        return new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            MustChangePassword = !user.HasSetPassword

        };
    }

    public async Task<LoginResponse> RefreshTokenAsync(string refreshToken)
    {
        var result = await _refreshTokenService.RefreshAsync(refreshToken);

        return new LoginResponse
        {
            AccessToken = result.AccessToken,
            RefreshToken = result.RefreshToken.RawToken
        };
    }

    public async Task ChangePasswordAsync(
    Guid userId,
    ChangePasswordRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new UnauthorizedAccessException("User not found.");

        var result = await _userManager.ChangePasswordAsync(
            user,
            request.CurrentPassword,
            request.NewPassword);

        if (!result.Succeeded)
            throw new Exception(string.Join(
                Environment.NewLine,
                result.Errors.Select(e => e.Description)));

        user.HasSetPassword = true;

        await _userManager.UpdateSecurityStampAsync(user);

        await _userManager.UpdateAsync(user);
    }


    public async Task LogoutAsync()
    {
        await _signInManager.SignOutAsync();
    }
}