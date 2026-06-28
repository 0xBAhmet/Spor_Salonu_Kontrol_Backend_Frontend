using Microsoft.EntityFrameworkCore;
using SporSalonu_Otomasyonu.Models;
using SporSalonu_Otomasyonu.Repositories.Interfaces;

namespace SporSalonu_Otomasyonu.Repositories
{
    public class PaketRepository : GenericRepository<UyelikPaketleri>, IPaketRepository
    {
        public PaketRepository(SporSalonuContext context) : base(context) { }

        public async Task<UyelikPaketleri?> GetByIdAsync(int paketId)
        {
            return await _dbSet.FindAsync(paketId);
        }

        public async Task<UyelikPaketleri?> GetByAdAsync(string paketAdi)
        {
            return await _dbSet
                .FirstOrDefaultAsync(p => p.PaketAdi == paketAdi);
        }

        public async Task<IEnumerable<UyelikPaketleri>> GetByFiyatAraligiAsync(decimal minFiyat, decimal maxFiyat)
        {
            return await _dbSet
                .Where(p => p.PaketFiyati >= minFiyat && p.PaketFiyati <= maxFiyat)
                .OrderBy(p => p.PaketFiyati)
                .ToListAsync();
        }

        public async Task<IEnumerable<UyelikPaketleri>> GetBySureAsync(int sureAy)
        {
            return await _dbSet
                .Where(p => p.SureAy == sureAy)
                .ToListAsync();
        }

        public async Task<UyelikPaketleri?> GetEnCokTercihEdilenPaketAsync()
        {
            return await _dbSet
                .Include(p => p.UyeOdemelers)
                .OrderByDescending(p => p.UyeOdemelers.Count)
                .FirstOrDefaultAsync();
        }
    }
}