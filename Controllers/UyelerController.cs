using Microsoft.AspNetCore.Mvc;
using SporSalonu_Otomasyonu.Models;
using SporSalonu_Otomasyonu.Repositories.Interfaces;

namespace SporSalonu_Otomasyonu.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UyelerController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public UyelerController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET api/uyeler
        [HttpGet]
        public async Task<IActionResult> GetUyeler()
        {
            var uyeler = await _unitOfWork.Uyeler.GetAllAsync();
            return Ok(uyeler);
        }

        // GET api/uyeler/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetUye(Guid id)
        {
            var uye = await _unitOfWork.Uyeler.GetByIdAsync(id);
            if (uye == null)
                return NotFound(new { message = "Üye bulunamadı." });

            return Ok(uye);
        }

        // GET api/uyeler/{id}/odemeler
        [HttpGet("{id:guid}/odemeler")]
        public async Task<IActionResult> GetUyeOdemeleri(Guid id)
        {
            var uye = await _unitOfWork.Uyeler.GetUyeWithOdemelerAsync(id);
            if (uye == null)
                return NotFound(new { message = "Üye bulunamadı." });

            return Ok(uye);
        }

        // POST api/uyeler
        [HttpPost]
        public async Task<IActionResult> UyeEkle([FromBody] Uyeler yeniUye)
        {
            yeniUye.UyeId = Guid.NewGuid();
            yeniUye.KayitTarihi = DateTime.Now;
            yeniUye.UyeDurumu = true;

            await _unitOfWork.Uyeler.AddAsync(yeniUye);
            await _unitOfWork.CompleteAsync();

            return Ok(new { message = "Üye başarıyla eklendi.", id = yeniUye.UyeId });
        }

        // PUT api/uyeler/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UyeGuncelle(Guid id, [FromBody] Uyeler guncellenenUye)
        {
            if (id != guncellenenUye.UyeId)
                return BadRequest(new { message = "ID uyuşmazlığı." });

            var mevcutUye = await _unitOfWork.Uyeler.GetByIdAsync(id);
            if (mevcutUye == null)
                return NotFound(new { message = "Üye bulunamadı." });

            mevcutUye.Ad = guncellenenUye.Ad;
            mevcutUye.Soyad = guncellenenUye.Soyad;
            mevcutUye.EMail = guncellenenUye.EMail;
            mevcutUye.Telefon = guncellenenUye.Telefon;
            mevcutUye.UyeDurumu = guncellenenUye.UyeDurumu;

            _unitOfWork.Uyeler.Update(mevcutUye);
            await _unitOfWork.CompleteAsync();

            return Ok(new { message = "Üye başarıyla güncellendi." });
        }

        // DELETE api/uyeler/{id}  →  fiziksel silme değil, pasife alma
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> UyePasifYap(Guid id)
        {
            var uye = await _unitOfWork.Uyeler.GetByIdAsync(id);
            if (uye == null)
                return NotFound(new { message = "Üye bulunamadı." });

            await _unitOfWork.Uyeler.SetUyeDurumuAsync(id, false);
            await _unitOfWork.CompleteAsync();

            return Ok(new { message = "Üye pasife alındı." });
        }
    }
}