using Microsoft.EntityFrameworkCore;
using SporSalonu_Otomasyonu.Models;
using SporSalonu_Otomasyonu.Repositories.Interfaces;

namespace SporSalonu_Otomasyonu.Repositories
{
    // GiderID int olduğu için Guid alan base.GetByIdAsync kullanılmaz;
    // int overload'u burada implemente ediyoruz.
    public class GiderRepository : GenericRepository<Giderler>, IGiderRepository
    {
        public GiderRepository(SporSalonuContext context) : base(context) { }

        // ─── int PK override ────────────────────────────────────────────

        public async Task<Giderler?> GetByIdAsync(int giderId)
        {
            return await _dbSet.FindAsync(giderId);
        }

        // ─── Filtreleme sorguları ────────────────────────────────────────

        public async Task<IEnumerable<Giderler>> GetByKategoriIdAsync(int kategoriId)
        {
            return await _dbSet
                .Where(g => g.KategoriId == kategoriId)
                .OrderByDescending(g => g.Tarih)
                .ToListAsync();
        }

        public async Task<IEnumerable<Giderler>> GetByTarihAraligiAsync(DateTime baslangic, DateTime bitis)
        {
            return await _dbSet
                .Where(g => g.Tarih >= baslangic && g.Tarih <= bitis)
                .OrderByDescending(g => g.Tarih)
                .ToListAsync();
        }

        public async Task<IEnumerable<Giderler>> GetAylikGiderlerAsync(int yil, int ay)
        {
            var baslangic = new DateTime(yil, ay, 1);
            var bitis = baslangic.AddMonths(1);
            return await _dbSet
                .Include(g => g.Kategori)
                .Where(g => g.Tarih >= baslangic && g.Tarih < bitis)
                .OrderByDescending(g => g.Tarih)
                .ToListAsync();
        }

        // ─── Include (JOIN) sorguları ────────────────────────────────────

        public async Task<IEnumerable<Giderler>> GetAllWithKategoriAsync()
        {
            return await _dbSet
                .Include(g => g.Kategori)
                .OrderByDescending(g => g.Tarih)
                .ToListAsync();
        }

        public async Task<Giderler?> GetByIdWithKategoriAsync(int giderId)
        {
            return await _dbSet
                .Include(g => g.Kategori)
                .FirstOrDefaultAsync(g => g.GiderId == giderId);
        }

        // ─── Tutar hesaplama ─────────────────────────────────────────────

        public async Task<decimal> GetToplamGiderAsync()
        {
            return await _dbSet.SumAsync(g => g.GiderTutar ?? 0);
        }

        public async Task<decimal> GetAylikToplamGiderAsync(int yil, int ay)
        {
            var baslangic = new DateTime(yil, ay, 1);
            var bitis = baslangic.AddMonths(1);
            return await _dbSet
                .Where(g => g.Tarih >= baslangic && g.Tarih < bitis)
                .SumAsync(g => g.GiderTutar ?? 0);
        }

        public async Task<decimal> GetKategoriToplamGiderAsync(int kategoriId)
        {
            return await _dbSet
                .Where(g => g.KategoriId == kategoriId)
                .SumAsync(g => g.GiderTutar ?? 0);
        }

        // ─── Kategori yönetimi ───────────────────────────────────────────

        public async Task<IEnumerable<GiderKategorileri>> GetAllKategorilerAsync()
        {
            return await _context.GiderKategorileris
                .OrderBy(k => k.KategoriId)
                .ToListAsync();
        }

        public async Task<GiderKategorileri?> GetKategoriByIdAsync(int kategoriId)
        {
            return await _context.GiderKategorileris
                .FindAsync(kategoriId);
        }

        public async Task AddKategoriAsync(GiderKategorileri kategori)
        {
            await _context.GiderKategorileris.AddAsync(kategori);
        }

        public void UpdateKategori(GiderKategorileri kategori)
        {
            _context.GiderKategorileris.Update(kategori);
        }

        public void RemoveKategori(GiderKategorileri kategori)
        {
            _context.GiderKategorileris.Remove(kategori);
        }
    }
}