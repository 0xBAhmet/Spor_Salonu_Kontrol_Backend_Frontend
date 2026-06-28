using SporSalonu_Otomasyonu.Models;

namespace SporSalonu_Otomasyonu.Repositories.Interfaces
{
    public interface IUyeRepository : IGenericRepository<Uyeler>
    {
        Task<IEnumerable<UyeOdemeGecmisiDto>> GetUyeOdemeGecmisiAsync(Guid uyeId);

        Task<IEnumerable<Uyeler>> GetAktifUyelerAsync();
        Task<IEnumerable<Uyeler>> GetPasifUyelerAsync();
        Task<Uyeler?> GetByEmailAsync(string email);
        Task<Uyeler?> GetUyeWithOdemelerAsync(Guid uyeId);
        Task SetUyeDurumuAsync(Guid uyeId, bool aktif);
    }
}