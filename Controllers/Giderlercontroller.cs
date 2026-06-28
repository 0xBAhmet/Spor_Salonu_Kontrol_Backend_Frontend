using Microsoft.AspNetCore.Mvc;
using SporSalonu_Otomasyonu.Models;
using SporSalonu_Otomasyonu.Repositories.Interfaces;

namespace SporSalonu_Otomasyonu.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GiderlerController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public GiderlerController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // ─── Giderler ────────────────────────────────────────────────────

        // GET api/giderler
        [HttpGet]
        public async Task<IActionResult> GetGiderler()
        {
            var giderler = await _unitOfWork.Giderler.GetAllWithKategoriAsync();
            return Ok(giderler);
        }

        // GET api/giderler/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetGider(int id)
        {
            var gider = await _unitOfWork.Giderler.GetByIdWithKategoriAsync(id);
            if (gider == null)
                return NotFound(new { message = "Gider bulunamadı." });

            return Ok(gider);
        }

        // GET api/giderler/kategori/{kategoriId}
        [HttpGet("kategori/{kategoriId:int}")]
        public async Task<IActionResult> GetByKategori(int kategoriId)
        {
            var giderler = await _unitOfWork.Giderler.GetByKategoriIdAsync(kategoriId);
            return Ok(giderler);
        }

        // GET api/giderler/listele/aylik?yil=2026&ay=6
        [HttpGet("listele/aylik")]
        public async Task<IActionResult> GetAylikGiderler([FromQuery] int yil, [FromQuery] int ay)
        {
            if (yil < 2000 || ay < 1 || ay > 12)
                return BadRequest(new { message = "Geçersiz yıl veya ay değeri." });

            var giderler = await _unitOfWork.Giderler.GetAylikGiderlerAsync(yil, ay);
            return Ok(giderler);
        }

        // GET api/giderler/tutar/toplam
        [HttpGet("tutar/toplam")]
        public async Task<IActionResult> GetToplamGider()
        {
            var toplam = await _unitOfWork.Giderler.GetToplamGiderAsync();
            return Ok(new { toplamGider = toplam });
        }

        // GET api/giderler/tutar/aylik?yil=2026&ay=6
        [HttpGet("tutar/aylik")]
        public async Task<IActionResult> GetAylikToplamGider([FromQuery] int yil, [FromQuery] int ay)
        {
            if (yil < 2000 || ay < 1 || ay > 12)
                return BadRequest(new { message = "Geçersiz yıl veya ay değeri." });

            var toplam = await _unitOfWork.Giderler.GetAylikToplamGiderAsync(yil, ay);
            return Ok(new { yil, ay, aylikGider = toplam });
        }

        // GET api/giderler/tutar/kategori/{kategoriId}
        [HttpGet("tutar/kategori/{kategoriId:int}")]
        public async Task<IActionResult> GetKategoriToplam(int kategoriId)
        {
            var toplam = await _unitOfWork.Giderler.GetKategoriToplamGiderAsync(kategoriId);
            return Ok(new { kategoriId, toplamGider = toplam });
        }

        // POST api/giderler
        [HttpPost]
        public async Task<IActionResult> GiderEkle([FromBody] Giderler yeniGider)
        {
            yeniGider.Tarih = DateTime.Now;

            await _unitOfWork.Giderler.AddAsync(yeniGider);
            await _unitOfWork.CompleteAsync();

            return Ok(new { message = "Gider başarıyla eklendi.", id = yeniGider.GiderId });
        }

        // PUT api/giderler/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> GiderGuncelle(int id, [FromBody] Giderler guncellenenGider)
        {
            if (id != guncellenenGider.GiderId)
                return BadRequest(new { message = "ID uyuşmazlığı." });

            var mevcutGider = await _unitOfWork.Giderler.GetByIdAsync(id);
            if (mevcutGider == null)
                return NotFound(new { message = "Gider bulunamadı." });

            mevcutGider.KategoriId = guncellenenGider.KategoriId;
            mevcutGider.GiderTutar = guncellenenGider.GiderTutar;
            mevcutGider.Tarih = guncellenenGider.Tarih;

            _unitOfWork.Giderler.Update(mevcutGider);
            await _unitOfWork.CompleteAsync();

            return Ok(new { message = "Gider başarıyla güncellendi." });
        }

        // DELETE api/giderler/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> GiderSil(int id)
        {
            var gider = await _unitOfWork.Giderler.GetByIdAsync(id);
            if (gider == null)
                return NotFound(new { message = "Gider bulunamadı." });

            _unitOfWork.Giderler.Remove(gider);
            await _unitOfWork.CompleteAsync();

            return Ok(new { message = "Gider başarıyla silindi." });
        }

        // ─── Kategoriler ─────────────────────────────────────────────────

        // GET api/giderler/kategoriler
        [HttpGet("kategoriler")]
        public async Task<IActionResult> GetKategoriler()
        {
            var kategoriler = await _unitOfWork.Giderler.GetAllKategorilerAsync();
            return Ok(kategoriler);
        }

        // GET api/giderler/kategoriler/{id}
        [HttpGet("kategoriler/{id:int}")]
        public async Task<IActionResult> GetKategori(int id)
        {
            var kategori = await _unitOfWork.Giderler.GetKategoriByIdAsync(id);
            if (kategori == null)
                return NotFound(new { message = "Kategori bulunamadı." });

            return Ok(kategori);
        }

        // POST api/giderler/kategoriler
        [HttpPost("kategoriler")]
        public async Task<IActionResult> KategoriEkle([FromBody] GiderKategorileri yeniKategori)
        {
            await _unitOfWork.Giderler.AddKategoriAsync(yeniKategori);
            await _unitOfWork.CompleteAsync();

            return Ok(new { message = "Kategori başarıyla eklendi.", id = yeniKategori.KategoriId });
        }

        // PUT api/giderler/kategoriler/{id}
        [HttpPut("kategoriler/{id:int}")]
        public async Task<IActionResult> KategoriGuncelle(int id, [FromBody] GiderKategorileri guncellenenKategori)
        {
            if (id != guncellenenKategori.KategoriId)
                return BadRequest(new { message = "ID uyuşmazlığı." });

            var mevcutKategori = await _unitOfWork.Giderler.GetKategoriByIdAsync(id);
            if (mevcutKategori == null)
                return NotFound(new { message = "Kategori bulunamadı." });

            mevcutKategori.KategoriAdi = guncellenenKategori.KategoriAdi;

            _unitOfWork.Giderler.UpdateKategori(mevcutKategori);
            await _unitOfWork.CompleteAsync();

            return Ok(new { message = "Kategori başarıyla güncellendi." });
        }

        // DELETE api/giderler/kategoriler/{id}
        [HttpDelete("kategoriler/{id:int}")]
        public async Task<IActionResult> KategoriSil(int id)
        {
            var kategori = await _unitOfWork.Giderler.GetKategoriByIdAsync(id);
            if (kategori == null)
                return NotFound(new { message = "Kategori bulunamadı." });

            _unitOfWork.Giderler.RemoveKategori(kategori);
            await _unitOfWork.CompleteAsync();

            return Ok(new { message = "Kategori başarıyla silindi." });
        }
    }
}