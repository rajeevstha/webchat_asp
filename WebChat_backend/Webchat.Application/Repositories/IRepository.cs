using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Webchat.Application.Repository
{
    public interface IRepository<T>
    {
        //Task<T?> GetByIdAsync(Guid id);

        Task<IEnumerable<T>> GetAllAsync();

        Task AddAsync(T entity);

        //Task UpdateAsync(T entity);

        //Task DeleteAsync(Guid id);
    }
}