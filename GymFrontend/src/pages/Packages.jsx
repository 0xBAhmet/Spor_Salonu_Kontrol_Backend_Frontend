import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../lib/api';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ paketId: null, paketAdi: '', paketFiyati: '', sureAy: '' });

  const fetchPackages = async () => {
    try {
      const res = await api.get('/paketler');
      setPackages(res.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPackages(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({ paketId: null, paketAdi: '', paketFiyati: '', sureAy: '' });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (pkg) => {
    setFormData({ paketId: pkg.paketId, paketAdi: pkg.paketAdi, paketFiyati: pkg.paketFiyati, sureAy: pkg.sureAy });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, paketFiyati: parseFloat(formData.paketFiyati), sureAy: parseInt(formData.sureAy, 10) };
      if (isEditMode) {
        await api.put(`/paketler/${formData.paketId}`, payload);
      } else {
        await api.post('/paketler', payload);
      }
      setIsModalOpen(false);
      fetchPackages();
    } catch (error) {
      console.error('Error saving package:', error);
      alert('Paket kaydedilirken bir hata oluştu.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu paketi silmek istediğinize emin misiniz?')) {
      try {
        await api.delete(`/paketler/${id}`);
        fetchPackages();
      } catch (error) {
        alert('Paket silinemedi. Bu pakete ait kayıtlar olabilir.');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Üyelik Paketleri</h1>
          <p className="page-subtitle">Spor salonundaki üyelik seçeneklerini yönetin</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /><span>Yeni Paket Ekle</span>
        </button>
      </div>

      <div className="card-section">
        {loading ? <p className="loading-text">Yükleniyor...</p> : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Paket Adı</th>
                  <th>Süre</th>
                  <th>Fiyat</th>
                  <th className="text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.paketId}>
                    <td className="font-medium">{pkg.paketAdi}</td>
                    <td>{pkg.sureAy} Ay</td>
                    <td>₺{pkg.paketFiyati}</td>
                    <td className="action-cell">
                      <button className="btn-icon btn-icon-secondary" onClick={() => openEditModal(pkg)}><Edit2 size={15} /></button>
                      <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(pkg.paketId)}><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
                {packages.length === 0 && (
                  <tr><td colSpan="4" className="empty-row">Kayıtlı paket bulunamadı.</td></tr>
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
              <h2 className="modal-title">{isEditMode ? 'Paketi Düzenle' : 'Yeni Paket Ekle'}</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Paket Adı</label>
                  <input type="text" className="form-input" name="paketAdi" value={formData.paketAdi} onChange={handleInputChange} required />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Fiyat (₺)</label>
                    <input type="number" step="0.01" className="form-input" name="paketFiyati" value={formData.paketFiyati} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Süre (Ay)</label>
                    <input type="number" className="form-input" name="sureAy" value={formData.sureAy} onChange={handleInputChange} required />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>İptal</button>
                <button type="submit" className="btn btn-primary">{isEditMode ? 'Güncelle' : 'Kaydet'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
