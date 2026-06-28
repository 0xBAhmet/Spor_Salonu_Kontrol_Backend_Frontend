# 🏋️ Spor Salonu Otomasyon Sistemi

Modern ve kullanımı kolay bir spor salonu yönetim uygulaması. C# (.NET) tabanlı REST API ile React (Vite) tabanlı arayüzden oluşmaktadır.

---

## 🚀 Özellikler

### 👥 Üye Yönetimi
- Yeni üye ekleme, bilgilerini düzenleme
- Üye arama (ad/soyad)
- Aktif / Pasif üye durumu yönetimi
- Üyelik süresi uzatma (mevcut bitiş tarihinden itibaren otomatik hesaplanır)

### 💳 Ödeme Yönetimi
- Üyelere ödeme kaydı ekleme
- Mevcut aktif üyeliğin bitiş tarihine göre otomatik süre hesaplama
- Ödeme geçmişini listeleme ve silme

### 📦 Paket Yönetimi
- Üyelik paketleri oluşturma, düzenleme ve silme
- Paket adı, fiyat ve süre (ay) bilgisi

### 💸 Gider Yönetimi
- Gider kaydı ekleme ve silme
- Kategoriye göre gider takibi
- Gider kategorileri yönetimi (ekleme, düzenleme, silme)

### 📊 Dashboard
- Aktif üye sayısı
- Toplam gelir
- Önümüzdeki 30 gün içinde üyeliği bitecek üyelerin listesi

### 📈 Grafikler & Tablolar
- Son 6 aylık gelir/gider karşılaştırma grafiği
- Kategoriye göre gider dağılımı (pasta grafik)
- Pakete göre gelir dağılımı (pasta grafik)

---

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Backend | C# / .NET 8 / Entity Framework Core |
| Mimari | Repository Pattern + Unit of Work |
| Veritabanı | SQL Server |
| Frontend | React 18 + Vite |
| Grafikler | Recharts |
| HTTP Client | Axios |
| İkonlar | Lucide React |

---

## ⚙️ Kurulum

### Backend
```bash
# Bağlantı dizesini appsettings.json içinde güncelleyin
# Ardından uygulamayı çalıştırın
dotnet run
```

API varsayılan olarak `https://localhost:7268` adresinde çalışır.

### Frontend
```bash
cd GymFrontend
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışır.

---

## 📱 Responsive Tasarım

Uygulama masaüstü ve mobil cihazlar için tam uyumlu (responsive) olarak tasarlanmıştır. Mobil görünümde gezinme çubuğu ekranın altına taşınarak modern bir uygulama deneyimi sunar.

---

## 🔗 API Uç Noktaları (Özet)

| Kaynak | Uç Nokta |
|--------|----------|
| Üyeler | `GET/POST/PUT/DELETE /api/uyeler` |
| Ödemeler | `GET/POST/DELETE /api/odemeler` |
| Paketler | `GET/POST/PUT/DELETE /api/paketler` |
| Giderler | `GET/POST/DELETE /api/giderler` |
| Kategoriler | `GET/POST/PUT/DELETE /api/giderler/kategoriler` |
| Yaklaşan Ödemeler | `GET /api/odemeler/suresi-dolanlar` |
