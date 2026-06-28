import React, { useEffect, useState } from 'react';
import { Users, AlertTriangle, DollarSign, Activity } from 'lucide-react';
import api from '../lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalMembers: 0, totalIncome: 0 });
  const [expiringMembers, setExpiringMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [membersRes, incomeRes, expiringRes] = await Promise.all([
          api.get('/uyeler'),
          api.get('/odemeler/gelir/toplam'),
          api.get('/odemeler/suresi-dolanlar')
        ]);
        
        // Count active members
        const activeMembers = membersRes.data.filter(m => m.uyeDurumu).length;
        
        setStats({
          totalMembers: activeMembers,
          totalIncome: incomeRes.data.toplamGelir || 0
        });
        
        setExpiringMembers(expiringRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Spor salonu genel durumu ve istatistikleri</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Aktif Üyeler</h3>
            <div className="value">{stats.totalMembers}</div>
          </div>
          <div className="stat-icon">
            <Users size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Toplam Gelir</h3>
            <div className="value">₺{stats.totalIncome.toLocaleString('tr-TR')}</div>
          </div>
          <div className="stat-icon green">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Ödemesi Yaklaşanlar</h3>
            <div className="value">{expiringMembers.length}</div>
          </div>
          <div className="stat-icon red">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Ödeme Tarihi Yaklaşan / Geçen Üyeler</h2>
        {expiringMembers.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Şu anda ödemesi yaklaşan üye bulunmamaktadır.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Üye Adı</th>
                  <th>Paket</th>
                  <th>Bitiş Tarihi</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {expiringMembers.map((odeme) => {
                  const bitis = new Date(odeme.bitisTarihi);
                  const isExpired = bitis < new Date();
                  
                  return (
                    <tr key={odeme.odemeId}>
                      <td style={{ fontWeight: 500 }}>
                        {odeme.uye ? `${odeme.uye.ad} ${odeme.uye.soyad}` : 'Bilinmeyen Üye'}
                      </td>
                      <td>{odeme.paket ? odeme.paket.paketAdi : 'Paket Yok'}</td>
                      <td>{bitis.toLocaleDateString('tr-TR')}</td>
                      <td>
                        <span className={`badge ${isExpired ? 'badge-danger' : 'badge-warning'}`}>
                          {isExpired ? 'Süresi Doldu' : 'Yaklaşıyor'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
