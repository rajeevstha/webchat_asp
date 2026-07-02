using System.Security.Cryptography;
using System.Text;
using Webchat.Application.Interfaces;
using Webchat.Application.Repositories;
using Webchat.Domain.Entities;
using WebChat.Domain.Entities;

namespace Webchat.Infrastructure.Services;

public class RefreshTokenService : IRefreshTokenService
{
    private readonly IRefreshTokenRepository _repository;
    private readonly IJwtService _jwtService;

    public RefreshTokenService(
        IRefreshTokenRepository repository,
        IJwtService jwtService)
    {
        _repository = repository;
        _jwtService = jwtService;
    }

    public async Task<RefreshTokenResult> CreateAsync(User user)
    {
        var rawToken = GenerateRefreshToken();

        var refreshToken = new RefreshToken(
            user.Id,
            Hash(rawToken),
            DateTime.UtcNow.AddDays(30));

        await _repository.AddAsync(refreshToken);
        await _repository.SaveChangesAsync();

        return new RefreshTokenResult(rawToken, refreshToken);
    }

    public async Task<(string AccessToken, RefreshTokenResult RefreshToken)> RefreshAsync(string refreshToken)
    {
        var hash = Hash(refreshToken);

        var existing = await _repository.GetByTokenHashAsync(hash);

        if (existing is null || !existing.IsActive)
            throw new UnauthorizedAccessException("Invalid or expired refresh token.");

        // Revoke the current refresh token (rotation)
        existing.Revoke();
        await _repository.UpdateAsync(existing);

        // Generate a new refresh token
        var rawToken = GenerateRefreshToken();

        var newRefreshToken = new RefreshToken(
            existing.UserId,
            Hash(rawToken),
            DateTime.UtcNow.AddDays(30));

        await _repository.AddAsync(newRefreshToken);
        await _repository.SaveChangesAsync();

        // Generate new access token
        var accessToken = await _jwtService.GenerateTokenAsync(existing.User);

        return (
            accessToken,
            new RefreshTokenResult(rawToken, newRefreshToken)
        );
    }

    public async Task RevokeAsync(string refreshToken)
    {
        var hash = Hash(refreshToken);

        var existing = await _repository.GetByTokenHashAsync(hash);

        if (existing is null)
            return;

        existing.Revoke();

        await _repository.UpdateAsync(existing);
        await _repository.SaveChangesAsync();
    }

    private static string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }

    private static string Hash(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(bytes);
    }
}