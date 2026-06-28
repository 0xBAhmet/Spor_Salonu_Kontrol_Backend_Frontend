using System;
using System.Collections.Generic;

namespace SporSalonu_Otomasyonu.Models;

public partial class UyeOdemeler
{
    public Guid OdemeId { get; set; }

    public Guid? UyeId { get; set; }

    public int? PaketId { get; set; }

    public decimal Ucret { get; set; }

    public DateTime OdemeTarihi { get; set; }

    public DateTime BitisTarihi { get; set; }

    public virtual UyelikPaketleri? Paket { get; set; }

    public virtual Uyeler? Uye { get; set; }
}
