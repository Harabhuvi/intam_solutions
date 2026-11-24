import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const AdminApp = () => {
  const [adminUser, setAdminUser] = useState(null);

  /* Restore session from localStorage on mount */
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user  = localStorage.getItem('adminUser');
    if (token && user) {
      try { setAdminUser(JSON.parse(user)); } catch { /* ignore */ }
    }
  }, []);

  const handleLogin = (admin) => setAdminUser(admin);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminUser(null);
  };

  if (!adminUser) return <AdminLogin onLogin={handleLogin} />;
  return <AdminDashboard adminUser={adminUser} onLogout={handleLogout} />;
};

export default AdminApp;
