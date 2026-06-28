using Microsoft.EntityFrameworkCore;
using SporSalonu_Otomasyonu.Models;
using SporSalonu_Otomasyonu.Repositories.Interfaces;
using System.Linq.Expressions;

namespace SporSalonu_Otomasyonu.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly SporSalonuContext _context;
        internal DbSet<T> _dbSet;

        public GenericRepository(SporSalonuContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<T> GetByIdAsync(Guid id)
        {
            return await _dbSet.FindAsync(id)
                ?? throw new KeyNotFoundException($"{typeof(T).Name} bulunamadı. ID: {id}");
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> expression)
        {
            return await _dbSet.Where(expression).ToListAsync();
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }

        public void Remove(T entity)
        {
            _dbSet.Remove(entity);
        }
    }
}
