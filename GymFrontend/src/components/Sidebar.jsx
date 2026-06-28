import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Activity, PieChart, Tag, TrendingDown } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/members', icon: Users, label: 'Üyeler' },
  { to: '/packages', icon: Activity, label: 'Paketler' },
  { to: '/payments', icon: CreditCard, label: 'Ödemeler' },
  { to: '/expenses', icon: TrendingDown, label: 'Giderler' },
  { to: '/expense-categories', icon: Tag, label: 'Kategoriler' },
  { to: '/charts', icon: PieChart, label: 'Tablolar' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Activity size={28} />
        <span>FitLife</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
