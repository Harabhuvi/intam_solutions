import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADMIN_LOGIN } from '../graphql/queries';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  const [adminLogin, { loading }] = useMutation(ADMIN_LOGIN);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await adminLogin({ variables: form });
      const { token, admin } = data.adminLogin;
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(admin));
      onLogin(admin);
    } catch (err) {
      setError(err.message || 'Login failed. Check credentials.');
    }
  };

  return (
    <div className="al-wrap">
      <div className="al-card">
        {/* Logo */}
        <div className="al-logo">
          <div className="al-logo__icon">🛡️</div>
          <div>
            <p className="al-logo__name">INTAM SOLUTIONS</p>
            <p className="al-logo__sub">Admin Portal</p>
          </div>
        </div>

        <h1 className="al-title">Sign in to Admin</h1>
        <p className="al-hint">Use your admin credentials to access the dashboard.</p>

        {error && (
          <div className="al-error" role="alert">
            ⚠ {error}
          </div>
        )}

        <form className="al-form" onSubmit={handleSubmit} noValidate>
          <div className="al-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="admin@intamsolutions.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="al-field">
            <label htmlFor="password">Password</label>
            <div className="al-pw-wrap">
              <input
                id="password"
                name="password"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="al-pw-toggle"
                onClick={() => setShowPw(!showPw)}
                aria-label="Toggle password visibility"
              >
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="al-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="al-spinner" />
            ) : (
              'Sign In →'
            )}
          </button>
        </form>

        <p className="al-footer-note">
          🔒 Secure admin access only. Unauthorised access is prohibited.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
