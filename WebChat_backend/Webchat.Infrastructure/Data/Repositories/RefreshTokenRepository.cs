using Webchat.Application.Repositories;
using WebChat.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Webchat.Infrastructure.Data.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly WebChatDbContext _context;

        public RefreshTokenRepository(WebChatDbContext context)
        {
            _context = context;
        }

        public async Task<RefreshToken?> GetByTokenHashAsync(string tokenHash)
        {
            return await _context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.TokenHash == tokenHash);
        }

        public async Task AddAsync(RefreshToken token)
        {
            await _context.RefreshTokens.AddAsync(token);
        }

        public Task UpdateAsync(RefreshToken token)
        {
            _context.RefreshTokens.Update(token);
            return Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
