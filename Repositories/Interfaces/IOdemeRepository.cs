using SporSalonu_Otomasyonu.Models;

namespace SporSalonu_Otomasyonu.Repositories.Interfaces
{
    public interface IOdemeRepository : IGenericRepository<UyeOdemeler>
    {
       

        Task<IEnumerable<UyeOdemeler>> GetByUyeIdAsync(Guid uyeId);
        Task<UyeOdemeler?> GetAktifOdemeByUyeIdAsync(Guid uyeId);
        Task<IEnumerable<UyeOdemeler>> GetByTarihAraligiAsync(DateTime baslangic, DateTime bitis);
        Task<IEnumerable<UyeOdemeler>> GetSuresiDolanOdemelerAsync();
        Task<IEnumerable<UyeOdemeler>> GetAllWithDetailsAsync();
        Task<UyeOdemeler?> GetByIdWithDetailsAsync(Guid odemeId);
        Task<decimal> GetToplamGelirAsync();
        Task<decimal> GetAylikGelirAsync(int yil, int ay);
    }
}