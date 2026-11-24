import React, { useState } from 'react';
import './Header.css';

const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Products',
    href: '/products',
    children: ['CCTV', 'Access Control', 'Fire Alarm', 'Networking'],
  },
  {
    label: 'Solutions',
    href: '/solutions',
    children: ['Residential', 'Commercial', 'Industrial'],
  },
  { label: 'Brands', href: '/brands' },
  { label: 'Projects', href: '/projects' },
  { label: 'Services & AMC', href: '/services' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <header className="header">
      {/* ── Top Bar ─────────────────────────────────────── */}
      <div className="header__topbar">
        <div className="header__topbar-inner container">
          <a href="tel:+919845012345" className="header__topbar-link">
            📞 +91 98450 12345
          </a>
          <a
            href="https://wa.me/919845012345"
            className="header__topbar-link header__topbar-link--whatsapp"
          >
            💬 WhatsApp
          </a>
          <a href="mailto:info@intamsolutions.com" className="header__topbar-link">
            ✉ info@intamsolutions.com
          </a>
        </div>
      </div>

      {/* ── Main Nav ─────────────────────────────────────── */}
      <div className="header__main container">
        {/* Logo */}
        <a href="/" className="header__logo">
          {/* Inline SVG shield — no image file needed */}
          <svg className="header__logo-img" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="10" fill="#1e3a8a"/>
            <path d="M24 8L10 14v10c0 8.4 5.9 16.3 14 18 8.1-1.7 14-9.6 14-18V14L24 8z" fill="#3b82f6"/>
            <path d="M20 24l3 3 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="header__logo-text">
            <span className="header__logo-name">INTAM</span>
            <span className="header__logo-sub">SOLUTIONS</span>
            <span className="header__logo-tagline">Smart Security. Intelligent Automation.</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="header__nav" aria-label="Main navigation">
          <ul className="header__nav-list">
            {navLinks.map((link) => (
              <li
                key={link.label}
                className={`header__nav-item ${link.children ? 'header__nav-item--dropdown' : ''}`}
                onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <a href={link.href} className="header__nav-link">
                  {link.label}
                  {link.children && <span className="header__nav-arrow">▾</span>}
                </a>

                {link.children && openDropdown === link.label && (
                  <ul className="header__dropdown">
                    {link.children.map((child) => (
                      <li key={child} className="header__dropdown-item">
                        <a href={`${link.href}/${child.toLowerCase().replace(/ /g, '-')}`}>
                          {child}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Search + Hamburger */}
        <div className="header__actions">
          <button className="header__search-btn" aria-label="Search">🔍</button>
          <button
            className="header__hamburger"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ───────────────────────────────────── */}
      {menuOpen && (
        <nav className="header__mobile-menu container">
          <ul>
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
