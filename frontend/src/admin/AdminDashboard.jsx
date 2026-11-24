import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_ENQUIRIES,
  GET_ENQUIRY_STATS,
  GET_ADMIN_PROFILE,
  UPDATE_ENQUIRY_STATUS,
  DELETE_ENQUIRY,
} from '../graphql/queries';
import './AdminDashboard.css';
import ProductManager from './ProductManager';
import './ProductManager.css';
import FooterManager from './FooterManager';
import './FooterManager.css';

/* ── Stat Card ───────────────────────────────────────── */
const StatCard = ({ label, value, icon, color }) => (
  <div className={`stat-card stat-card--${color}`}>
    <div className="stat-card__icon">{icon}</div>
    <div>
      <p className="stat-card__value">{value ?? '—'}</p>
      <p className="stat-card__label">{label}</p>
    </div>
  </div>
);

/* ── Status Badge ────────────────────────────────────── */
const Badge = ({ status }) => (
  <span className={`badge badge--${status}`}>
    {status === 'pending'     ? '🕐 Pending'
     : status === 'resolved'  ? '✅ Resolved'
     : status === 'in-progress' ? '🔄 In Progress'
     : status}
  </span>
);

/* ── Enquiry Row ─────────────────────────────────────── */
const EnquiryRow = ({ q, onStatusChange, onDelete, onView }) => (
  <tr className="enq-row">
    <td className="enq-row__info">
      <p className="enq-row__name">{q.name}</p>
      <p className="enq-row__email">{q.email}</p>
      {q.phone && <p className="enq-row__phone">📞 {q.phone}</p>}
    </td>
    <td className="enq-row__message">
      <p className="enq-row__msg-preview">{q.message}</p>
    </td>
    <td className="enq-row__status">
      <Badge status={q.status} />
    </td>
    <td className="enq-row__date">
      {new Date(Number(q.createdAt)).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
      })}
    </td>
    <td className="enq-row__actions">
      <button className="act-btn act-btn--view" onClick={() => onView(q)} title="View full enquiry">👁</button>
      {q.status !== 'resolved' && (
        <button
          className="act-btn act-btn--resolve"
          onClick={() => onStatusChange(q.id, 'resolved')}
          title="Mark resolved"
        >✅</button>
      )}
      {q.status !== 'pending' && (
        <button
          className="act-btn act-btn--reopen"
          onClick={() => onStatusChange(q.id, 'pending')}
          title="Mark pending"
        >🔄</button>
      )}
      <button
        className="act-btn act-btn--delete"
        onClick={() => onDelete(q.id, q.name)}
        title="Delete enquiry"
      >🗑</button>
    </td>
  </tr>
);

/* ── Detail Modal ────────────────────────────────────── */
const DetailModal = ({ enquiry, onClose, onStatusChange }) => {
  if (!enquiry) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3>Enquiry Detail</h3>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="modal__body">
          <div className="modal__row"><span>Name</span><strong>{enquiry.name}</strong></div>
          <div className="modal__row"><span>Email</span><a href={`mailto:${enquiry.email}`}>{enquiry.email}</a></div>
          {enquiry.phone && <div className="modal__row"><span>Phone</span><a href={`tel:${enquiry.phone}`}>{enquiry.phone}</a></div>}
          <div className="modal__row"><span>Status</span><Badge status={enquiry.status} /></div>
          <div className="modal__row"><span>Received</span>
            {new Date(Number(enquiry.createdAt)).toLocaleString('en-IN')}
          </div>
          <div className="modal__message">
            <p className="modal__message-label">Message</p>
            <p className="modal__message-text">{enquiry.message}</p>
          </div>
          <div className="modal__actions">
            <a href={`mailto:${enquiry.email}`} className="btn-modal btn-modal--email">
              📧 Reply via Email
            </a>
            {enquiry.phone && (
              <a href={`https://wa.me/${enquiry.phone.replace(/\D/g, '')}`}
                 target="_blank" rel="noreferrer"
                 className="btn-modal btn-modal--wa">
                💬 WhatsApp
              </a>
            )}
            {enquiry.status !== 'resolved' && (
              <button
                className="btn-modal btn-modal--resolve"
                onClick={() => { onStatusChange(enquiry.id, 'resolved'); onClose(); }}
              >✅ Mark Resolved</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════════════ */
const AdminDashboard = ({ adminUser, onLogout }) => {
  const [section, setSection] = useState('enquiries');
  const [filter, setFilter]   = useState('all');
  const [search, setSearch]   = useState('');
  const [selected, setSelected] = useState(null);

  const { data: statsData, refetch: refetchStats } = useQuery(GET_ENQUIRY_STATS);
  const { data: profileData } = useQuery(GET_ADMIN_PROFILE);

  const { data, loading, refetch } = useQuery(GET_ENQUIRIES, {
    variables: {
      status: filter === 'all' ? undefined : filter,
      search: search || undefined,
    },
  });

  const [updateStatus] = useMutation(UPDATE_ENQUIRY_STATUS, {
    onCompleted: () => { refetch(); refetchStats(); },
  });
  const [deleteEnquiry] = useMutation(DELETE_ENQUIRY, {
    onCompleted: () => { refetch(); refetchStats(); },
  });

  const handleStatusChange = (id, status) =>
    updateStatus({ variables: { id, status } });

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete enquiry from "${name}"? This cannot be undone.`))
      deleteEnquiry({ variables: { id } });
  };

  const stats  = statsData?.enquiryStats;
  const admin  = profileData?.adminProfile || adminUser;
  const enquiries = data?.contactQueries || [];

  return (
    <div className="adm">
      {/* ── Sidebar ────────────────────────────────── */}
      <aside className="adm__sidebar">
        <div className="adm__sidebar-logo">
          <span className="adm__sidebar-icon">🛡️</span>
          <div>
            <p className="adm__sidebar-brand">INTAM</p>
            <p className="adm__sidebar-sub">Admin Panel</p>
          </div>
        </div>

        <nav className="adm__nav">
          <button className={`adm__nav-item ${section === 'enquiries' ? 'adm__nav-item--active' : ''}`} onClick={() => setSection('enquiries')}>
            📋 Enquiries
          </button>
          <button className={`adm__nav-item ${section === 'products' ? 'adm__nav-item--active' : ''}`} onClick={() => setSection('products')}>
            Products
          </button>
          <button className={`adm__nav-item ${section === 'footer' ? 'adm__nav-item--active' : ''}`} onClick={() => setSection('footer')}>
            Footer Content
          </button>
          <a href="/" className="adm__nav-item" target="_blank" rel="noreferrer">
            🌐 View Website
          </a>
        </nav>

        <div className="adm__sidebar-footer">
          <div className="adm__admin-info">
            <div className="adm__admin-avatar">{admin?.name?.[0] || 'A'}</div>
            <div>
              <p className="adm__admin-name">{admin?.name || 'Admin'}</p>
              <p className="adm__admin-role">{admin?.role || 'admin'}</p>
            </div>
          </div>
          <button className="adm__logout" onClick={onLogout}>⏻ Logout</button>
        </div>
      </aside>

      {/* ── Main area ──────────────────────────────── */}
      <main className="adm__main">
        {section === 'products' ? <ProductManager /> : section === 'footer' ? <FooterManager /> : <>
        {/* Top bar */}
        <div className="adm__topbar">
          <div>
            <h1 className="adm__page-title">Customer Enquiries</h1>
            <p className="adm__page-sub">Manage and respond to all incoming customer enquiries.</p>
          </div>
          <button className="adm__refresh" onClick={() => { refetch(); refetchStats(); }}>
            🔄 Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="adm__stats">
          <StatCard label="Total Enquiries" value={stats?.total}     icon="📊" color="blue" />
          <StatCard label="Pending"          value={stats?.pending}   icon="🕐" color="yellow" />
          <StatCard label="Resolved"         value={stats?.resolved}  icon="✅" color="green" />
          <StatCard label="Today"            value={stats?.todayCount}icon="📅" color="purple" />
        </div>

        {/* Filter + Search bar */}
        <div className="adm__toolbar">
          <div className="adm__filters">
            {['all', 'pending', 'in-progress', 'resolved'].map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'filter-btn--active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="adm__search-wrap">
            <span className="adm__search-icon">🔍</span>
            <input
              type="search"
              placeholder="Search by name, email, message…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="adm__search"
            />
          </div>
        </div>

        {/* Table */}
        <div className="adm__table-wrap">
          {loading ? (
            <div className="adm__loading">
              <div className="adm__spinner" />
              <p>Loading enquiries…</p>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="adm__empty">
              <p className="adm__empty-icon">📭</p>
              <p>No enquiries found.</p>
            </div>
          ) : (
            <table className="enq-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((q) => (
                  <EnquiryRow
                    key={q.id}
                    q={q}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    onView={setSelected}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="adm__count">
          Showing {enquiries.length} enquir{enquiries.length === 1 ? 'y' : 'ies'}
        </p>
        </>}
      </main>

      {/* Detail Modal */}
      <DetailModal
        enquiry={selected}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default AdminDashboard;
