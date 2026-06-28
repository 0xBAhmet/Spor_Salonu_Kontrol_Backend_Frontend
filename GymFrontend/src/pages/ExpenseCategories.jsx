import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../lib/api';

export default function ExpenseCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ kategoriId: null, kategoriAdi: '' });

  const fetchCategories = async () => {
    try {
      const res = await api.get('/giderler/kategoriler');
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({ kategoriId: null, kategoriAdi: '' });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setFormData({ kategoriId: cat.kategoriId, kategoriAdi: cat.kategoriAdi });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { kategoriId: formData.kategoriId || 0, kategoriAdi: formData.kategoriAdi };
      if (isEditMode) {
        await api.put(`/giderler/kategoriler/${formData.kategoriId}`, payload);
      } else {
        await api.post('/giderler/kategoriler', payload);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Kategori kaydedilirken bir hata oluştu.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
      try {
        await api.delete(`/giderler/kategoriler/${id}`);
        fetchCategories();
      } catch (error) {
        alert('Silinirken hata oluştu. Bu kategoriye ait giderler olabilir.');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gider Kategorileri</h1>
          <p className="page-subtitle">Giderlerinizi gruplamak için kategorileri yönetin</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /><span>Yeni Kategori Ekle</span>
        </button>
      </div>

      <div className="card-section">
        {loading ? <p className="loading-text">Yükleniyor...</p> : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Kategori Adı</th>
                  <th className="text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.kategoriId}>
                    <td>{cat.kategoriId}</td>
                    <td className="font-medium">{cat.kategoriAdi}</td>
                    <td className="action-cell">
                      <button className="btn-icon btn-icon-secondary" onClick={() => openEditModal(cat)}><Edit2 size={15} /></button>
                      <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(cat.kategoriId)}><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr><td colSpan="3" className="empty-row">Kategori bulunamadı.</td></tr>
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
              <h2 className="modal-title">{isEditMode ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Kategori Adı</label>
                  <input type="text" className="form-input" name="kategoriAdi" value={formData.kategoriAdi} onChange={handleInputChange} required />
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
