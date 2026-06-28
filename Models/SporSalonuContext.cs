using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SporSalonu_Otomasyonu.Models;

public partial class SporSalonuContext : DbContext
{
    public SporSalonuContext()
    {
    }

    public SporSalonuContext(DbContextOptions<SporSalonuContext> options)
        : base(options)
    {
    }

    public virtual DbSet<GiderKategorileri> GiderKategorileris { get; set; }

    public virtual DbSet<Giderler> Giderlers { get; set; }

    public virtual DbSet<UyeOdemeler> UyeOdemelers { get; set; }

    public virtual DbSet<Uyeler> Uyelers { get; set; }

    public virtual DbSet<UyeOdemeGecmisiDto> UyeOdemeGecmisiRaporu { get; set; }

    public virtual DbSet<UyelikPaketleri> UyelikPaketleris { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        
        modelBuilder.Entity<UyeOdemeGecmisiDto>().HasNoKey();

        modelBuilder.Entity<GiderKategorileri>(entity =>
        {
            entity.HasKey(e => e.KategoriId).HasName("PK__GiderKat__1782CC929BCDFA97");

            entity.ToTable("GiderKategorileri");

            entity.Property(e => e.KategoriId).HasColumnName("KategoriID");
            entity.Property(e => e.KategoriAdi)
                .HasMaxLength(50)
                .HasColumnName("Kategori_Adi");
        });

        modelBuilder.Entity<Giderler>(entity =>
        {
            entity.HasKey(e => e.GiderId).HasName("PK__Giderler__60E504D6FC6D6B54");

            entity.ToTable("Giderler");

            entity.Property(e => e.GiderId).HasColumnName("GiderID");
            entity.Property(e => e.GiderTutar)
                .HasColumnType("money")
                .HasColumnName("Gider_Tutar");
            entity.Property(e => e.KategoriId).HasColumnName("KategoriID");
            entity.Property(e => e.Tarih)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Kategori).WithMany(p => p.Giderlers)
                .HasForeignKey(d => d.KategoriId)
                .HasConstraintName("FK__Giderler__Katego__31EC6D26");
        });

        modelBuilder.Entity<UyeOdemeler>(entity =>
        {
            entity.HasKey(e => e.OdemeId).HasName("PK__Uye_Odem__B11B66ADEC633BC2");

            entity.ToTable("Uye_Odemeler");

            entity.Property(e => e.OdemeId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("OdemeID");
            entity.Property(e => e.BitisTarihi)
                .HasColumnType("datetime")
                .HasColumnName("Bitis_Tarihi");
            entity.Property(e => e.OdemeTarihi)
                .HasColumnType("datetime")
                .HasColumnName("Odeme_Tarihi");
            entity.Property(e => e.PaketId).HasColumnName("PaketID");
            entity.Property(e => e.Ucret).HasColumnType("money");
            entity.Property(e => e.UyeId).HasColumnName("UyeID");

            entity.HasOne(d => d.Paket).WithMany(p => p.UyeOdemelers)
                .HasForeignKey(d => d.PaketId)
                .HasConstraintName("FK__Uye_Odeme__Paket__2D27B809");

            entity.HasOne(d => d.Uye).WithMany(p => p.UyeOdemelers)
                .HasForeignKey(d => d.UyeId)
                .HasConstraintName("FK__Uye_Odeme__UyeID__2C3393D0");
        });

        modelBuilder.Entity<Uyeler>(entity =>
        {
            entity.HasKey(e => e.UyeId).HasName("PK__Uyeler__76F7D9EF03D5DC5F");

            entity.ToTable("Uyeler");

            entity.Property(e => e.UyeId)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("UyeID");
            entity.Property(e => e.Ad).HasMaxLength(25);
            entity.Property(e => e.EMail)
                .HasMaxLength(255)
                .HasColumnName("E_mail");
            entity.Property(e => e.KayitTarihi)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Soyad).HasMaxLength(25);
            entity.Property(e => e.Telefon).HasMaxLength(11);
            entity.Property(e => e.UyeDurumu)
                .HasDefaultValue(true)
                .HasColumnName("Uye_Durumu");
        });

        modelBuilder.Entity<UyelikPaketleri>(entity =>
        {
            entity.HasKey(e => e.PaketId).HasName("PK__UyelikPa__2F326FF96D5F478F");

            entity.ToTable("UyelikPaketleri");

            entity.Property(e => e.PaketId).HasColumnName("PaketID");
            entity.Property(e => e.PaketAdi)
                .HasMaxLength(25)
                .HasColumnName("Paket_Adi");
            entity.Property(e => e.PaketFiyati)
                .HasColumnType("money")
                .HasColumnName("Paket_Fiyati");
            entity.Property(e => e.SureAy).HasColumnName("Sure_Ay");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
