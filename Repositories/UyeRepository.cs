using Microsoft.EntityFrameworkCore;
using SporSalonu_Otomasyonu.Models;
using SporSalonu_Otomasyonu.Repositories.Interfaces;

namespace SporSalonu_Otomasyonu.Repositories
{
    public class UyeRepository : GenericRepository<Uyeler>, IUyeRepository
    {
        public UyeRepository(SporSalonuContext context) : base(context) { }

        public async Task<IEnumerable<UyeOdemeGecmisiDto>> GetUyeOdemeGecmisiAsync(Guid uyeId)
        {
            return await _context.UyeOdemeGecmisiRaporu
                .FromSqlRaw("EXEC sp_UyeOdemeGecmisi @ArananUyeID = {0}", uyeId)
                .ToListAsync();
        }
        public async Task<IEnumerable<Uyeler>> GetAktifUyelerAsync()
        {
            return await _dbSet
                .Where(u => u.UyeDurumu == true)
                .OrderBy(u => u.Soyad)
                .ToListAsync();
        }

        public async Task<IEnumerable<Uyeler>> GetPasifUyelerAsync()
        {
            return await _dbSet
                .Where(u => u.UyeDurumu == false)
                .OrderBy(u => u.Soyad)
                .ToListAsync();
        }

        public async Task<Uyeler?> GetByEmailAsync(string email)
        {
            return await _dbSet
                .FirstOrDefaultAsync(u => u.EMail == email);
        }

        public async Task<Uyeler?> GetUyeWithOdemelerAsync(Guid uyeId)
        {
            return await _dbSet
                .Include(u => u.UyeOdemelers)
                    .ThenInclude(o => o.Paket)
                .FirstOrDefaultAsync(u => u.UyeId == uyeId);
        }

        public async Task SetUyeDurumuAsync(Guid uyeId, bool aktif)
        {
            var uye = await _dbSet.FindAsync(uyeId);
            if (uye == null) return;

            uye.UyeDurumu = aktif;
            _dbSet.Update(uye);
        }
    }
}

