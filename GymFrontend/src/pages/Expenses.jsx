import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import api from '../lib/api';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ kategoriId: '', giderTutar: '' });

  const fetchData = async () => {
    try {
      const [expRes, catRes] = await Promise.all([api.get('/giderler'), api.get('/giderler/kategoriler')]);
      setExpenses(expRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/giderler', { kategoriId: parseInt(formData.kategoriId, 10), giderTutar: parseFloat(formData.giderTutar) });
      setIsModalOpen(false);
      setFormData({ kategoriId: '', giderTutar: '' });
      fetchData();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Gider kaydedilirken bir hata oluştu.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu gider kaydını silmek istediğinize emin misiniz?')) {
      try {
        await api.delete(`/giderler/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Giderler</h1>
          <p className="page-subtitle">Spor salonunun gider kayıtlarını yönetin</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /><span>Gider Ekle</span>
        </button>
      </div>

      <div className="card-section">
        {loading ? <p className="loading-text">Yükleniyor...</p> : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Kategori</th>
                  <th>Tutar</th>
                  <th>Tarih</th>
                  <th className="text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.giderId}>
                    <td className="font-medium">{exp.kategori ? exp.kategori.kategoriAdi : 'Kategori Yok'}</td>
                    <td>₺{exp.giderTutar}</td>
                    <td>{new Date(exp.tarih).toLocaleDateString('tr-TR')}</td>
                    <td className="action-cell">
                      <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(exp.giderId)}><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr><td colSpan="4" className="empty-row">Gider kaydı bulunamadı.</td></tr>
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
              <h2 className="modal-title">Yeni Gider Ekle</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Kategori Seçimi</label>
                  <select className="form-input" name="kategoriId" value={formData.kategoriId} onChange={handleInputChange} required>
                    <option value="">-- Kategori Seçin --</option>
                    {categories.map(c => <option key={c.kategoriId} value={c.kategoriId}>{c.kategoriAdi}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Gider Tutarı (₺)</label>
                  <input type="number" step="0.01" className="form-input" name="giderTutar" value={formData.giderTutar} onChange={handleInputChange} required />
                </div>
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
