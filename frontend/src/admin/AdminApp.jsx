import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const isTokenValid = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return !payload.exp || payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const AdminApp = () => {
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user  = localStorage.getItem('adminUser');
    if (token && user && isTokenValid(token)) {
      try { setAdminUser(JSON.parse(user)); } catch {  }
    } else {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
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
