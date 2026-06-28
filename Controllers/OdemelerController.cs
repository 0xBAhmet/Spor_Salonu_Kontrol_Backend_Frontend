using Microsoft.AspNetCore.Mvc;
using SporSalonu_Otomasyonu.Models;
using SporSalonu_Otomasyonu.Repositories.Interfaces;

namespace SporSalonu_Otomasyonu.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OdemelerController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public OdemelerController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET api/odemeler
        [HttpGet]
        public async Task<IActionResult> GetOdemeler()
        {
            var odemeler = await _unitOfWork.Odemeler.GetAllWithDetailsAsync();
            return Ok(odemeler);
        }

        // GET api/odemeler/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetOdeme(Guid id)
        {
            var odeme = await _unitOfWork.Odemeler.GetByIdWithDetailsAsync(id);
            if (odeme == null)
                return NotFound(new { message = "Ödeme bulunamadı." });

            return Ok(odeme);
        }

        // GET api/odemeler/uye/{uyeId}
        [HttpGet("uye/{uyeId:guid}")]
        public async Task<IActionResult> GetUyeOdemeleri(Guid uyeId)
        {
            var odemeler = await _unitOfWork.Odemeler.GetByUyeIdAsync(uyeId);
            return Ok(odemeler);
        }

        // GET api/odemeler/uye/{uyeId}/aktif
        [HttpGet("uye/{uyeId:guid}/aktif")]
        public async Task<IActionResult> GetAktifOdeme(Guid uyeId)
        {
            var odeme = await _unitOfWork.Odemeler.GetAktifOdemeByUyeIdAsync(uyeId);
            if (odeme == null)
                return NotFound(new { message = "Aktif üyelik bulunamadı." });

            return Ok(odeme);
        }

        // GET api/odemeler/suresi-dolanlar
        [HttpGet("suresi-dolanlar")]
        public async Task<IActionResult> GetSuresiDolanlar()
        {
            var odemeler = await _unitOfWork.Odemeler.GetSuresiDolanOdemelerAsync();
            return Ok(odemeler);
        }

        // GET api/odemeler/gelir/toplam
        [HttpGet("gelir/toplam")]
        public async Task<IActionResult> GetToplamGelir()
        {
            var toplam = await _unitOfWork.Odemeler.GetToplamGelirAsync();
            return Ok(new { toplamGelir = toplam });
        }

        // GET api/odemeler/gelir/aylik?yil=2025&ay=6
        [HttpGet("gelir/aylik")]
        public async Task<IActionResult> GetAylikGelir([FromQuery] int yil, [FromQuery] int ay)
        {
            if (yil < 2000 || ay < 1 || ay > 12)
                return BadRequest(new { message = "Geçersiz yıl veya ay değeri." });

            var toplam = await _unitOfWork.Odemeler.GetAylikGelirAsync(yil, ay);
            return Ok(new { yil, ay, aylikGelir = toplam });
        }

        // POST api/odemeler
        [HttpPost]
        public async Task<IActionResult> OdemeEkle([FromBody] UyeOdemeler yeniOdeme)
        {
            yeniOdeme.OdemeId = Guid.NewGuid();

            await _unitOfWork.Odemeler.AddAsync(yeniOdeme);
            await _unitOfWork.CompleteAsync();

            return Ok(new { message = "Ödeme başarıyla eklendi.", id = yeniOdeme.OdemeId });
        }

        // PUT api/odemeler/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> OdemeGuncelle(Guid id, [FromBody] UyeOdemeler guncellenenOdeme)
        {
            if (id != guncellenenOdeme.OdemeId)
                return BadRequest(new { message = "ID uyuşmazlığı." });

            var mevcutOdeme = await _unitOfWork.Odemeler.GetByIdAsync(id);
            if (mevcutOdeme == null)
                return NotFound(new { message = "Ödeme bulunamadı." });

            mevcutOdeme.UyeId = guncellenenOdeme.UyeId;
            mevcutOdeme.PaketId = guncellenenOdeme.PaketId;
            mevcutOdeme.Ucret = guncellenenOdeme.Ucret;
            mevcutOdeme.OdemeTarihi = guncellenenOdeme.OdemeTarihi;
            mevcutOdeme.BitisTarihi = guncellenenOdeme.BitisTarihi;

            _unitOfWork.Odemeler.Update(mevcutOdeme);
            await _unitOfWork.CompleteAsync();

            return Ok(new { message = "Ödeme başarıyla güncellendi." });
        }

        // DELETE api/odemeler/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> OdemeSil(Guid id)
        {
            var odeme = await _unitOfWork.Odemeler.GetByIdAsync(id);
            if (odeme == null)
                return NotFound(new { message = "Ödeme bulunamadı." });

            _unitOfWork.Odemeler.Remove(odeme);
            await _unitOfWork.CompleteAsync();

            return Ok(new { message = "Ödeme başarıyla silindi." });
        }
    }
}