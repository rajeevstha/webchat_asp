using System;
using System.Collections.Generic;
using System.Text;
using Webchat.Domain.Entities;
using WebChat.Domain.Entities;

namespace Webchat.Application.Interfaces
{
    public record RefreshTokenResult(
    string RawToken,
    RefreshToken Entity);

    public interface IRefreshTokenService
    {
        Task<RefreshTokenResult> CreateAsync(User user);

        Task<(string AccessToken, RefreshTokenResult RefreshToken)> RefreshAsync(string refreshToken);

        Task RevokeAsync(string refreshToken);
    }

}
