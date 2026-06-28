using System.Linq.Expressions;

namespace SporSalonu_Otomasyonu.Repositories.Interfaces
{
    
    public interface IGenericRepository<T> where T : class
    {
    
        Task<IEnumerable<T>> GetAllAsync();

    
        Task<T> GetByIdAsync(Guid id); // Üyeler için GUID kullandık, int olan tablolar için overload veya object kullanılabilir.

    
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> expression);


        Task AddAsync(T entity);


        void Update(T entity); 

        void Remove(T entity);
    }
}
