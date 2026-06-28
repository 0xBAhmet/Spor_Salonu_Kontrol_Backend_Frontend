import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import api from '../lib/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff7f50'];

export default function Charts() {
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [packageIncome, setPackageIncome] = useState([]);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        const [payRes, expRes] = await Promise.all([
          api.get('/odemeler'),
          api.get('/giderler')
        ]);

        const payments = payRes.data || [];
        const expenses = expRes.data || [];

        // 1. Process Monthly Data (Last 6 Months)
        const months = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          months.push({
            year: d.getFullYear(),
            month: d.getMonth() + 1, // 1-12
            monthName: d.toLocaleString('tr-TR', { month: 'short' }),
            gelir: 0,
            gider: 0
          });
        }

        payments.forEach(p => {
          const d = new Date(p.odemeTarihi);
          const m = months.find(x => x.year === d.getFullYear() && x.month === (d.getMonth() + 1));
          if (m) m.gelir += p.ucret;
        });

        expenses.forEach(e => {
          const d = new Date(e.tarih);
          const m = months.find(x => x.year === d.getFullYear() && x.month === (d.getMonth() + 1));
          if (m) m.gider += e.giderTutar;
        });

        setMonthlyData(months.map(m => ({
          name: `${m.monthName} ${m.year}`,
          Gelir: m.gelir,
          Gider: m.gider
        })));

        // 2. Process Expenses by Category
        const catMap = {};
        expenses.forEach(e => {
          const catName = e.kategori ? e.kategori.kategoriAdi : 'Diğer';
          catMap[catName] = (catMap[catName] || 0) + e.giderTutar;
        });
        const catChartData = Object.keys(catMap).map(k => ({
          name: k,
          value: catMap[k]
        }));
        setExpenseCategories(catChartData);

        // 3. Process Income by Package
        const pkgMap = {};
        payments.forEach(p => {
          const pkgName = p.paket ? p.paket.paketAdi : 'Diğer';
          pkgMap[pkgName] = (pkgMap[pkgName] || 0) + p.ucret;
        });
        const pkgChartData = Object.keys(pkgMap).map(k => ({
          name: k,
          value: pkgMap[k]
        }));
        setPackageIncome(pkgChartData);

      } catch (error) {
        console.error("Error generating charts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Grafikler Yükleniyor...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Grafikler ve Tablolar</h1>
          <p className="page-subtitle">İşletmenizin finansal durumunu görsel olarak analiz edin</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--text-main)' }}>Son 6 Aylık Gelir - Gider Tablosu</h2>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <BarChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'var(--bg-glass)', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
              />
              <Legend />
              <Bar dataKey="Gelir" fill="var(--success)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Gider" fill="var(--danger)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-grid">
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--text-main)', textAlign: 'center' }}>Kategoriye Göre Giderler</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--text-main)', textAlign: 'center' }}>Pakete Göre Gelir Dağılımı</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={packageIncome}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {packageIncome.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
