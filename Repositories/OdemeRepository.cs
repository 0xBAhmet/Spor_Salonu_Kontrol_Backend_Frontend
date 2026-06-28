using Microsoft.EntityFrameworkCore;
using SporSalonu_Otomasyonu.Models;
using SporSalonu_Otomasyonu.Repositories.Interfaces;

namespace SporSalonu_Otomasyonu.Repositories
{
    public class OdemeRepository : GenericRepository<UyeOdemeler>, IOdemeRepository
    {
        public OdemeRepository(SporSalonuContext context) : base(context) { }

        public async Task<IEnumerable<UyeOdemeler>> GetByUyeIdAsync(Guid uyeId)
        {
            return await _dbSet
                .Where(o => o.UyeId == uyeId)
                .OrderByDescending(o => o.OdemeTarihi)
                .ToListAsync();
        }

        public async Task<UyeOdemeler?> GetAktifOdemeByUyeIdAsync(Guid uyeId)
        {
            var bugun = DateTime.Now;
            return await _dbSet
                .Where(o => o.UyeId == uyeId && o.BitisTarihi >= bugun)
                .OrderByDescending(o => o.BitisTarihi)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<UyeOdemeler>> GetByTarihAraligiAsync(DateTime baslangic, DateTime bitis)
        {
            return await _dbSet
                .Where(o => o.OdemeTarihi>= baslangic && o.OdemeTarihi<= bitis)
                .OrderByDescending(o => o.OdemeTarihi)
                .ToListAsync();
        }

        public async Task<IEnumerable<UyeOdemeler>> GetSuresiDolanOdemelerAsync()
        {
            var bugun = DateTime.Now;
            var yaklasanTarih = bugun.AddDays(14);

            var tumOdemeler = await _dbSet
                .Include(o => o.Uye)
                .Include(o => o.Paket)
                .Where(o => o.Uye.UyeDurumu == true)
                .ToListAsync();

            var result = tumOdemeler
                .GroupBy(o => o.UyeId)
                .Select(g => g.OrderByDescending(o => o.BitisTarihi).FirstOrDefault())
                .Where(o => o != null && o.BitisTarihi <= yaklasanTarih)
                .OrderBy(o => o.BitisTarihi)
                .ToList();

            return result;
        }

        public async Task<IEnumerable<UyeOdemeler>> GetAllWithDetailsAsync()
        {
            return await _dbSet
                .Include(o => o.Uye)
                .Include(o => o.Paket)
                .OrderByDescending(o => o.OdemeTarihi)
                .ToListAsync();
        }

        public async Task<UyeOdemeler?> GetByIdWithDetailsAsync(Guid odemeId)
        {
            return await _dbSet
                .Include(o => o.Uye)
                .Include(o => o.Paket)
                .FirstOrDefaultAsync(o => o.OdemeId == odemeId);
        }

        public async Task<decimal> GetToplamGelirAsync()
        {
            return await _dbSet.SumAsync(o => o.Ucret);
        }

        public async Task<decimal> GetAylikGelirAsync(int yil, int ay)
        {
            var baslangic = new DateTime(yil, ay, 1);
            var bitis = baslangic.AddMonths(1);
            return await _dbSet
                .Where(o => o.OdemeTarihi >= baslangic && o.OdemeTarihi < bitis)
                .SumAsync(o => o.Ucret);
        }

    }
}