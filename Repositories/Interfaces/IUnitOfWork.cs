namespace SporSalonu_Otomasyonu.Repositories.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IUyeRepository Uyeler { get; }
        IPaketRepository Paketler { get; }
        IGiderRepository Giderler { get; }
        IOdemeRepository Odemeler { get; }
        Task<int> CompleteAsync();
    }
}
