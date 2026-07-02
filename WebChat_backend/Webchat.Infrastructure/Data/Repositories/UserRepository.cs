using Microsoft.EntityFrameworkCore;
using Webchat.Application.Repository;
using Webchat.Domain.Entities;
using Webchat.Infrastructure.Data;

namespace Webchat.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly WebChatDbContext _context;

    public UserRepository(WebChatDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(User entity)
    {
        await _context.Users.AddAsync(entity);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _context.Users
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetAllExceptAsync(Guid currentUserId)
    {
        return await _context.Users
            .Where(u => u.Id != currentUserId)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task DeleteAsync(User user)
    {
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }

}
