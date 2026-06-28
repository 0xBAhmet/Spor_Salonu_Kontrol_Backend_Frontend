using System;
using System.Collections.Generic;

namespace SporSalonu_Otomasyonu.Models;

public partial class GiderKategorileri
{
    public int KategoriId { get; set; }

    public string? KategoriAdi { get; set; }

    public virtual ICollection<Giderler> Giderlers { get; set; } = new List<Giderler>();
}
