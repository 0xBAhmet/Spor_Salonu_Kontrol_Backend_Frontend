using SporSalonu_Otomasyonu.Models;

namespace SporSalonu_Otomasyonu.Repositories.Interfaces
{
    public interface IPaketRepository : IGenericRepository<UyelikPaketleri>
    {

        Task<UyelikPaketleri?> GetByIdAsync(int paketId);           
        Task<UyelikPaketleri?> GetByAdAsync(string paketAdi);
        Task<IEnumerable<UyelikPaketleri>> GetByFiyatAraligiAsync(decimal minFiyat, decimal maxFiyat);
        Task<IEnumerable<UyelikPaketleri>> GetBySureAsync(int sureAy);
        Task<UyelikPaketleri?> GetEnCokTercihEdilenPaketAsync();
    }
}