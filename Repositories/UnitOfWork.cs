using SporSalonu_Otomasyonu.Models;
using SporSalonu_Otomasyonu.Repositories.Interfaces;

namespace SporSalonu_Otomasyonu.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly SporSalonuContext _context;

        public IUyeRepository Uyeler { get; private set; }
        public IPaketRepository Paketler { get; private set; }
        public IGiderRepository Giderler { get; private set; }
        public IOdemeRepository Odemeler { get; private set; }

        public UnitOfWork(SporSalonuContext context)
        {
            _context = context;
            Uyeler = new UyeRepository(_context);
            Paketler = new PaketRepository(_context);
            Giderler = new GiderRepository(_context);
            Odemeler = new OdemeRepository(_context);
        }


        public async Task<int> CompleteAsync() => await _context.SaveChangesAsync();
        public void Dispose() => _context.Dispose();
    }
}
