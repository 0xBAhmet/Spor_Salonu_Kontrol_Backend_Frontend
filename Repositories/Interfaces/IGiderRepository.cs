using SporSalonu_Otomasyonu.Models;

namespace SporSalonu_Otomasyonu.Repositories.Interfaces
{
    public interface IGiderRepository : IGenericRepository<Giderler>
    {

        Task<Giderler?> GetByIdAsync(int giderId);
        Task<IEnumerable<Giderler>> GetByKategoriIdAsync(int kategoriId);
        Task<IEnumerable<Giderler>> GetByTarihAraligiAsync(DateTime baslangic, DateTime bitis);
        Task<IEnumerable<Giderler>> GetAylikGiderlerAsync(int yil, int ay);
        Task<IEnumerable<Giderler>> GetAllWithKategoriAsync();
        Task<Giderler?> GetByIdWithKategoriAsync(int giderId);
        Task<decimal> GetToplamGiderAsync();
        Task<decimal> GetAylikToplamGiderAsync(int yil, int ay);
        Task<decimal> GetKategoriToplamGiderAsync(int kategoriId);

        // Kategori yönetimi
        Task<IEnumerable<GiderKategorileri>> GetAllKategorilerAsync();
        Task<GiderKategorileri?> GetKategoriByIdAsync(int kategoriId);
        Task AddKategoriAsync(GiderKategorileri kategori);
        void UpdateKategori(GiderKategorileri kategori);
        void RemoveKategori(GiderKategorileri kategori);
    }
}