
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



<img width="1920" height="1080" alt="6" src="https://github.com/user-attachments/assets/d62640ce-afe1-411a-9201-662930403885" />
<img width="1920" height="1080" alt="5" src="https://github.com/user-attachments/assets/836c2fcc-d28f-4e6a-bcf1-bae453f4cf25" />
<img width="1920" height="1080" alt="4" src="https://github.com/user-attachments/assets/14f8b93f-dd3b-487a-9ac1-6ce13993403c" />
<img width="1920" height="1080" alt="3" src="https://github.com/user-attachments/assets/c2e9fe3b-a3f8-4441-b286-ee816bd688f1" />
<img width="1920" height="1080" alt="2" src="https://github.com/user-attachments/assets/6d7a6683-831e-4bea-a93b-92f2bf50edca" />
<img width="1920" height="1080" alt="1" src="https://github.com/user-attachments/assets/3bebf0f8-883d-452d-b31d-f45e321fc2f6" />
