import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Search, X, Clock } from 'lucide-react';
import api from '../lib/api';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Member add/edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ ad: '', soyad: '', eMail: '', telefon: '', uyeDurumu: true });

  // Membership extend modal
  const [isExtendOpen, setIsExtendOpen] = useState(false);
  const [extendMember, setExtendMember] = useState(null);
  const [extendForm, setExtendForm] = useState({ paketId: '', ucret: '', odemeTarihi: new Date().toISOString().split('T')[0], bitisTarihi: '' });

  const fetchMembers = async () => {
    try {
      const [memRes, pkgRes] = await Promise.all([api.get('/uyeler'), api.get('/paketler')]);
      setMembers(memRes.data);
      setPackages(pkgRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  /* ── Member form ── */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const openAddModal = () => {
    setFormData({ ad: '', soyad: '', eMail: '', telefon: '', uyeDurumu: true });
    setIsEditMode(false);
    setEditId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (uye) => {
    setFormData({ ad: uye.ad, soyad: uye.soyad, eMail: uye.eMail || '', telefon: uye.telefon || '', uyeDurumu: uye.uyeDurumu });
    setEditId(uye.uyeId);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/uyeler/${editId}`, { ...formData, uyeId: editId });
      } else {
        await api.post('/uyeler', formData);
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (error) {
      console.error('Error saving member:', error);
      alert('Üye kaydedilirken bir hata oluştu.');
    }
  };

  const handleToggleStatus = async (uye) => {
    try {
      await api.put(`/uyeler/${uye.uyeId}`, { ...uye, uyeDurumu: !uye.uyeDurumu });
      fetchMembers();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Üye durumu değiştirilirken bir hata oluştu.');
    }
  };

  /* ── Extend membership ── */
  const openExtendModal = async (uye) => {
    setExtendMember(uye);
    setIsExtendOpen(true);
    setExtendForm({ paketId: '', ucret: '', odemeTarihi: new Date().toISOString().split('T')[0], bitisTarihi: '', mevcutBitis: null });

    // Fetch current active payment to know when membership ends
    try {
      const res = await api.get(`/odemeler/uye/${uye.uyeId}/aktif`);
      const aktif = res.data;
      if (aktif && aktif.bitisTarihi) {
        const mevcutBitis = new Date(aktif.bitisTarihi);
        setExtendForm(prev => ({
          ...prev,
          mevcutBitis: mevcutBitis.toISOString().split('T')[0],
        }));
      }
    } catch {
      // No active payment found — extend from today
    }
  };

  const handleExtendInput = (e) => {
    const { name, value } = e.target;
    setExtendForm(prev => {
      const newForm = { ...prev, [name]: value };

      if (name === 'paketId' || name === 'odemeTarihi') {
        const pkgId = name === 'paketId' ? value : prev.paketId;
        const pkg = packages.find(p => p.paketId.toString() === pkgId.toString());

        if (pkg) {
          // Base date: if there's an active membership ending in the future, extend from there
          // Otherwise extend from payment date (today/selected)
          const today = new Date();
          const mevcutBitisDate = prev.mevcutBitis ? new Date(prev.mevcutBitis) : null;
          const baseDate = mevcutBitisDate && mevcutBitisDate > today
            ? new Date(mevcutBitisDate)
            : new Date(name === 'odemeTarihi' ? value : prev.odemeTarihi);

          baseDate.setMonth(baseDate.getMonth() + pkg.sureAy);
          newForm.bitisTarihi = baseDate.toISOString().split('T')[0];
          if (name === 'paketId') newForm.ucret = pkg.paketFiyati;
        }
      }

      return newForm;
    });
  };

  const handleExtendSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/odemeler', {
        uyeId: extendMember.uyeId,
        paketId: parseInt(extendForm.paketId, 10),
        ucret: parseFloat(extendForm.ucret),
        odemeTarihi: new Date(extendForm.odemeTarihi).toISOString(),
        bitisTarihi: new Date(extendForm.bitisTarihi).toISOString(),
      });
      setIsExtendOpen(false);
      alert(`${extendMember.ad} ${extendMember.soyad} üyeliği başarıyla uzatıldı!`);
    } catch (error) {
      console.error('Error extending membership:', error);
      alert('Üyelik uzatılırken bir hata oluştu.');
    }
  };

  const filteredMembers = members.filter(m =>
    m.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.soyad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Üyeler</h1>
          <p className="page-subtitle">Spor salonu üyelerini yönetin</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /><span>Yeni Üye Ekle</span>
        </button>
      </div>

      <div className="card-section">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Üye adı veya soyadı ile ara..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {loading ? <p className="loading-text">Yükleniyor...</p> : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ad Soyad</th>
                  <th className="col-hide-mobile">E-Posta</th>
                  <th className="col-hide-mobile">Telefon</th>
                  <th className="col-hide-mobile">Kayıt Tarihi</th>
                  <th>Durum</th>
                  <th className="text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((uye) => (
                  <tr key={uye.uyeId}>
                    <td className="font-medium">{uye.ad} {uye.soyad}</td>
                    <td className="col-hide-mobile">{uye.eMail || '-'}</td>
                    <td className="col-hide-mobile">{uye.telefon || '-'}</td>
                    <td className="col-hide-mobile">{new Date(uye.kayitTarihi).toLocaleDateString('tr-TR')}</td>
                    <td>
                      <span className={`badge ${uye.uyeDurumu ? 'badge-success' : 'badge-danger'}`}>
                        {uye.uyeDurumu ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="action-cell">
                      <button className="btn-icon btn-icon-secondary" title="Düzenle" onClick={() => openEditModal(uye)}>
                        <Edit2 size={15} />
                      </button>
                      {uye.uyeDurumu && (
                        <button className="btn-icon btn-icon-extend" title="Üyeliği Uzat" onClick={() => openExtendModal(uye)}>
                          <Clock size={15} />
                        </button>
                      )}
                      <button
                        className={uye.uyeDurumu ? 'btn-status btn-status-danger' : 'btn-status btn-status-success'}
                        onClick={() => handleToggleStatus(uye)}
                      >
                        {uye.uyeDurumu ? 'Pasif' : 'Aktif Yap'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredMembers.length === 0 && (
                  <tr><td colSpan="6" className="empty-row">Üye bulunamadı.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add / Edit Member Modal ── */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{isEditMode ? 'Üyeyi Düzenle' : 'Yeni Üye Ekle'}</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Ad</label>
                    <input type="text" className="form-input" name="ad" value={formData.ad} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Soyad</label>
                    <input type="text" className="form-input" name="soyad" value={formData.soyad} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">E-Posta</label>
                  <input type="email" className="form-input" name="eMail" value={formData.eMail} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefon</label>
                  <input type="tel" className="form-input" name="telefon" value={formData.telefon} onChange={handleInputChange} />
                </div>
                {isEditMode && (
                  <div className="checkbox-group">
                    <input type="checkbox" id="uyeDurumu" name="uyeDurumu" checked={formData.uyeDurumu} onChange={handleInputChange} />
                    <label htmlFor="uyeDurumu">Üye Aktif</label>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>İptal</button>
                <button type="submit" className="btn btn-primary">{isEditMode ? 'Güncelle' : 'Kaydet'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Extend Membership Modal ── */}
      {isExtendOpen && extendMember && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Üyeliği Uzat</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {extendMember.ad} {extendMember.soyad}
                </p>
              </div>
              <button className="modal-close" onClick={() => setIsExtendOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleExtendSubmit}>
              <div className="modal-body">

                {/* Current expiry info */}
                {extendForm.mevcutBitis && (
                  <div className="extend-info-box" style={{ marginBottom: '1.25rem', background: 'rgba(245,158,11,0.07)', borderColor: 'rgba(245,158,11,0.3)', color: 'var(--warning)' }}>
                    <Clock size={16} />
                    <span>Mevcut üyelik bitiş tarihi: <strong>{new Date(extendForm.mevcutBitis).toLocaleDateString('tr-TR')}</strong></span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Paket Seçimi</label>
                  <select className="form-input" name="paketId" value={extendForm.paketId} onChange={handleExtendInput} required>
                    <option value="">-- Paket Seçin --</option>
                    {packages.map(p => (
                      <option key={p.paketId} value={p.paketId}>
                        {p.paketAdi} — {p.sureAy} Ay — ₺{p.paketFiyati}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Ödeme Tarihi</label>
                    <input type="date" className="form-input" name="odemeTarihi" value={extendForm.odemeTarihi} onChange={handleExtendInput} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ücret (₺)</label>
                    <input type="number" step="0.01" className="form-input" name="ucret" value={extendForm.ucret} onChange={handleExtendInput} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Yeni Bitiş Tarihi</label>
                  <input type="date" className="form-input" name="bitisTarihi" value={extendForm.bitisTarihi} onChange={handleExtendInput} required />
                </div>

                {/* New expiry confirmation */}
                {extendForm.bitisTarihi && (
                  <div className="extend-info-box">
                    <Clock size={16} />
                    <span>
                      {extendForm.mevcutBitis && new Date(extendForm.mevcutBitis) > new Date()
                        ? <>Mevcut tarihin üzerine eklendi → Yeni bitiş: <strong>{new Date(extendForm.bitisTarihi).toLocaleDateString('tr-TR')}</strong></>
                        : <>Yeni üyelik bitiş tarihi: <strong>{new Date(extendForm.bitisTarihi).toLocaleDateString('tr-TR')}</strong></>
                      }
                    </span>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsExtendOpen(false)}>İptal</button>
                <button type="submit" className="btn btn-primary">
                  <Clock size={16} /> Üyeliği Uzat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
