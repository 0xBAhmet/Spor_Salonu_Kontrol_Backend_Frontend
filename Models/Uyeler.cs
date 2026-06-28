using System;
using System.Collections.Generic;

namespace SporSalonu_Otomasyonu.Models;

public partial class Uyeler
{
    public Guid UyeId { get; set; }

    public string Ad { get; set; } = null!;

    public string Soyad { get; set; } = null!;

    public string? EMail { get; set; }

    public string? Telefon { get; set; }

    public DateTime? KayitTarihi { get; set; }

    public bool UyeDurumu { get; set; }

    public virtual ICollection<UyeOdemeler> UyeOdemelers { get; set; } = new List<UyeOdemeler>();
}
