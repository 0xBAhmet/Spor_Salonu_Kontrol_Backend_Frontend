using System;
using System.Collections.Generic;

namespace SporSalonu_Otomasyonu.Models;

public partial class Giderler
{
    public int GiderId { get; set; }

    public int? KategoriId { get; set; }

    public decimal? GiderTutar { get; set; }

    public DateTime? Tarih { get; set; }

    public virtual GiderKategorileri? Kategori { get; set; }
}
