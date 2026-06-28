import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';

import Packages from './pages/Packages';
import Payments from './pages/Payments';
import Expenses from './pages/Expenses';
import ExpenseCategories from './pages/ExpenseCategories';
import Charts from './pages/Charts';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/expense-categories" element={<ExpenseCategories />} />
          <Route path="/charts" element={<Charts />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
