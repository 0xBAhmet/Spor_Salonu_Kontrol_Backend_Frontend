namespace SporSalonu_Otomasyonu.Models
{
    public class UyeOdemeGecmisiDto
    {
        public string Ad { get; set; }
        public string Soyad { get; set; }
        public string Paket_Adi { get; set; }
        public decimal OdenenTutar { get; set; } 
        public DateTime Odeme_Tarihi { get; set; }
        public DateTime Bitis_Tarihi { get; set; }
    }
}
