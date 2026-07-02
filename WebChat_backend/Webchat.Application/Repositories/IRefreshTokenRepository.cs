using System;
using System.Collections.Generic;
using System.Text;
using WebChat.Domain.Entities;

namespace Webchat.Application.Repositories
{
   public interface IRefreshTokenRepository
    {
        Task<RefreshToken?> GetByTokenHashAsync(string tokenHash);
        Task AddAsync(RefreshToken token);
        Task UpdateAsync(RefreshToken token);
        Task SaveChangesAsync();
    }
}
