using Microsoft.AspNetCore.Mvc;
using SporSalonu_Otomasyonu.Models;
using SporSalonu_Otomasyonu.Repositories.Interfaces;

namespace SporSalonu_Otomasyonu.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaketlerController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public PaketlerController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET api/paketler
        [HttpGet]
        public async Task<IActionResult> GetPaketler()
        {
            var paketler = await _unitOfWork.Paketler.GetAllAsync();
            return Ok(paketler);
        }

        // GET api/paketler/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetPaket(int id)
        {
            var paket = await _unitOfWork.Paketler.GetByIdAsync(id);
            if (paket == null)
                return NotFound(new { message = "Paket bulunamadı." });

            return Ok(paket);
        }

        // GET api/paketler/en-cok-tercih-edilen
        [HttpGet("en-cok-tercih-edilen")]
        public async Task<IActionResult> GetEnCokTercihEdilen()
        {
            var paket = await _unitOfWork.Paketler.GetEnCokTercihEdilenPaketAsync();
            if (paket == null)
                return NotFound(new { message = "Henüz hiç ödeme kaydı yok." });

            return Ok(paket);
        }

        // GET api/paketler/sure/{sureAy}
        [HttpGet("sure/{sureAy:int}")]
        public async Task<IActionResult> GetBySure(int sureAy)
        {
            var paketler = await _unitOfWork.Paketler.GetBySureAsync(sureAy);
            return Ok(paketler);
        }

        // GET api/paketler/fiyat?min=100&max=500
        [HttpGet("fiyat")]
        public async Task<IActionResult> GetByFiyatAraligi([FromQuery] decimal min, [FromQuery] decimal max)
        {
            if (min < 0 || max < min)
                return BadRequest(new { message = "Geçersiz fiyat aralığı." });

            var paketler = await _unitOfWork.Paketler.GetByFiyatAraligiAsync(min, max);
            return Ok(paketler);
        }

        // POST api/paketler
        [HttpPost]
        public async Task<IActionResult> PaketEkle([FromBody] UyelikPaketleri yeniPaket)
        {
            await _unitOfWork.Paketler.AddAsync(yeniPaket);
            await _unitOfWork.CompleteAsync();

            return Ok(new { message = "Paket başarıyla eklendi.", id = yeniPaket.PaketId });
        }

        // PUT api/paketler/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> PaketGuncelle(int id, [FromBody] UyelikPaketleri guncellenenPaket)
        {
            if (id != guncellenenPaket.PaketId)
                return BadRequest(new { message = "ID uyuşmazlığı." });

            var mevcutPaket = await _unitOfWork.Paketler.GetByIdAsync(id);
            if (mevcutPaket == null)
                return NotFound(new { message = "Paket bulunamadı." });

            mevcutPaket.PaketAdi = guncellenenPaket.PaketAdi;
            mevcutPaket.PaketFiyati = guncellenenPaket.PaketFiyati;
            mevcutPaket.SureAy = guncellenenPaket.SureAy;

            _unitOfWork.Paketler.Update(mevcutPaket);
            await _unitOfWork.CompleteAsync();

            return Ok(new { message = "Paket başarıyla güncellendi." });
        }

        // DELETE api/paketler/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> PaketSil(int id)
        {
            var paket = await _unitOfWork.Paketler.GetByIdAsync(id);
            if (paket == null)
                return NotFound(new { message = "Paket bulunamadı." });

            _unitOfWork.Paketler.Remove(paket);
            await _unitOfWork.CompleteAsync();

            return Ok(new { message = "Paket başarıyla silindi." });
        }
    }
}