using System;
using System.Collections.Generic;

namespace SporSalonu_Otomasyonu.Models;

public partial class UyelikPaketleri
{
    public int PaketId { get; set; }

    public string? PaketAdi { get; set; }

    public decimal? PaketFiyati { get; set; }

    public int? SureAy { get; set; }

    public virtual ICollection<UyeOdemeler> UyeOdemelers { get; set; } = new List<UyeOdemeler>();
}
