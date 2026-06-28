import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X, Clock } from 'lucide-react';
import api from '../lib/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    uyeId: '',
    paketId: '',
    ucret: '',
    odemeTarihi: new Date().toISOString().split('T')[0],
    bitisTarihi: '',
    mevcutBitis: null,   // aktif ödemenin bitiş tarihi
  });

  const fetchData = async () => {
    try {
      const [payRes, memRes, pkgRes] = await Promise.all([
        api.get('/odemeler'),
        api.get('/uyeler'),
        api.get('/paketler'),
      ]);
      setPayments(payRes.data);
      setMembers(memRes.data.filter(m => m.uyeDurumu));
      setPackages(pkgRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Üye seçilince aktif ödemesini çek
  const fetchAktifOdeme = async (uyeId) => {
    if (!uyeId) return null;
    try {
      const res = await api.get(`/odemeler/uye/${uyeId}/aktif`);
      return res.data?.bitisTarihi ? new Date(res.data.bitisTarihi) : null;
    } catch {
      return null;
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const newForm = { ...prev, [name]: value };
      return newForm;
    });

    // Üye değişince aktif ödemesini getir
    if (name === 'uyeId') {
      const mevcutBitisDate = await fetchAktifOdeme(value);
      setFormData(prev => ({
        ...prev,
        uyeId: value,
        mevcutBitis: mevcutBitisDate ? mevcutBitisDate.toISOString().split('T')[0] : null,
        bitisTarihi: '',
        paketId: '',
        ucret: '',
      }));
      return;
    }

    // Paket veya ödeme tarihi değişince bitiş tarihini hesapla
    if (name === 'paketId' || name === 'odemeTarihi') {
      setFormData(prev => {
        const newForm = { ...prev, [name]: value };
        const pkgId = name === 'paketId' ? value : prev.paketId;
        const pkg = packages.find(p => p.paketId.toString() === pkgId.toString());

        if (pkg) {
          const today = new Date();
          const mevcutBitisDate = prev.mevcutBitis ? new Date(prev.mevcutBitis) : null;
          // Eğer aktif üyelik gelecekte bitiyorsa o tarihten uzat, yoksa bugünden
          const baseDate = mevcutBitisDate && mevcutBitisDate > today
            ? new Date(mevcutBitisDate)
            : new Date(name === 'odemeTarihi' ? value : prev.odemeTarihi);

          baseDate.setMonth(baseDate.getMonth() + pkg.sureAy);
          newForm.bitisTarihi = baseDate.toISOString().split('T')[0];
          if (name === 'paketId') newForm.ucret = pkg.paketFiyati;
        }
        return newForm;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/odemeler', {
        uyeId: formData.uyeId,
        paketId: parseInt(formData.paketId, 10),
        ucret: parseFloat(formData.ucret),
        odemeTarihi: new Date(formData.odemeTarihi).toISOString(),
        bitisTarihi: new Date(formData.bitisTarihi).toISOString(),
      });
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving payment:', error);
      alert('Ödeme kaydedilirken bir hata oluştu.');
    }
  };

  const openModal = () => {
    setFormData({
      uyeId: '', paketId: '', ucret: '',
      odemeTarihi: new Date().toISOString().split('T')[0],
      bitisTarihi: '', mevcutBitis: null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu ödeme kaydını silmek istediğinize emin misiniz?')) {
      try {
        await api.delete(`/odemeler/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Ödemeler</h1>
          <p className="page-subtitle">Üye ödeme geçmişini ve yeni ödemeleri yönetin</p>
        </div>
        <button className="btn btn-primary" onClick={openModal}>
          <Plus size={18} /><span>Ödeme Al</span>
        </button>
      </div>

      <div className="card-section">
        {loading ? <p className="loading-text">Yükleniyor...</p> : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Üye</th>
                  <th className="col-hide-mobile">Paket</th>
                  <th>Ücret</th>
                  <th className="col-hide-mobile">Ödeme Tarihi</th>
                  <th>Bitiş Tarihi</th>
                  <th className="text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((pay) => (
                  <tr key={pay.odemeId}>
                    <td className="font-medium">{pay.uye ? `${pay.uye.ad} ${pay.uye.soyad}` : '-'}</td>
                    <td className="col-hide-mobile">{pay.paket ? pay.paket.paketAdi : '-'}</td>
                    <td>₺{pay.ucret}</td>
                    <td className="col-hide-mobile">{new Date(pay.odemeTarihi).toLocaleDateString('tr-TR')}</td>
                    <td>{new Date(pay.bitisTarihi).toLocaleDateString('tr-TR')}</td>
                    <td className="action-cell">
                      <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(pay.odemeId)}><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr><td colSpan="6" className="empty-row">Ödeme kaydı bulunamadı.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Yeni Ödeme Al</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">

                <div className="form-group">
                  <label className="form-label">Üye Seçimi</label>
                  <select className="form-input" name="uyeId" value={formData.uyeId} onChange={handleInputChange} required>
                    <option value="">-- Üye Seçin --</option>
                    {members.map(m => <option key={m.uyeId} value={m.uyeId}>{m.ad} {m.soyad}</option>)}
                  </select>
                </div>

                {/* Aktif üyelik bilgisi */}
                {formData.mevcutBitis && (
                  <div className="extend-info-box" style={{ marginBottom: '1.25rem', background: 'rgba(245,158,11,0.07)', borderColor: 'rgba(245,158,11,0.3)', color: 'var(--warning)' }}>
                    <Clock size={16} />
                    <span>Mevcut üyelik bitiş tarihi: <strong>{new Date(formData.mevcutBitis).toLocaleDateString('tr-TR')}</strong></span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Paket Seçimi</label>
                  <select className="form-input" name="paketId" value={formData.paketId} onChange={handleInputChange} required>
                    <option value="">-- Paket Seçin --</option>
                    {packages.map(p => <option key={p.paketId} value={p.paketId}>{p.paketAdi} ({p.sureAy} Ay - ₺{p.paketFiyati})</option>)}
                  </select>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Ödenen Ücret (₺)</label>
                    <input type="number" step="0.01" className="form-input" name="ucret" value={formData.ucret} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ödeme Tarihi</label>
                    <input type="date" className="form-input" name="odemeTarihi" value={formData.odemeTarihi} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Bitiş Tarihi</label>
                  <input type="date" className="form-input" name="bitisTarihi" value={formData.bitisTarihi} onChange={handleInputChange} required />
                </div>

                {/* Yeni bitiş tarihi özeti */}
                {formData.bitisTarihi && (
                  <div className="extend-info-box">
                    <Clock size={16} />
                    <span>
                      {formData.mevcutBitis && new Date(formData.mevcutBitis) > new Date()
                        ? <>Mevcut tarihin üzerine eklendi → Yeni bitiş: <strong>{new Date(formData.bitisTarihi).toLocaleDateString('tr-TR')}</strong></>
                        : <>Yeni üyelik bitiş tarihi: <strong>{new Date(formData.bitisTarihi).toLocaleDateString('tr-TR')}</strong></>
                      }
                    </span>
                  </div>
                )}

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>İptal</button>
                <button type="submit" className="btn btn-primary">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
