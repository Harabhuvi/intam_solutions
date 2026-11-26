import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Menu, X, ChevronDown } from 'lucide-react';
import { useProductSearch } from '../../graphql/useProductSearch';
import useWhatsappSettings from '../../hooks/useWhatsappSettings';

import '../style/Header.css';

const navLinks = [
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

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const { search, ready, totalProducts } = useProductSearch();
  const inputRef = useRef(null);
  const wrapRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    if (q.trim().length >= 2) {
      setResults(search(q));   // ← O(1) HashMap lookup
      setOpen(true);
    } else {
      setResults([]);
      setOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      setQuery('');
    }
  };

  const handleSelect = (product) => {
    navigate(`/products?q=${encodeURIComponent(product.name)}`);
    setOpen(false);
    setQuery('');
  };

  return (
    <div className="search-bar" ref={wrapRef}>
      <form className="search-bar__form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="search-bar__input"
          type="search"
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={ready ? `Search ${totalProducts} products…` : 'Loading…'}
          aria-label="Search products"
          autoComplete="off"
        />
        <button type="submit" className="search-bar__btn" aria-label="Search">
          <Search size={17} strokeWidth={2} />
        </button>
      </form>

      { }
      {open && results.length > 0 && (
        <ul className="search-bar__dropdown" role="listbox">
          {results.map((p) => (
            <li
              key={p.id}
              className="search-bar__item"
              role="option"
              onMouseDown={() => handleSelect(p)}   // mouseDown fires before blur
            >
              <img
                src={p.image || `https://picsum.photos/seed/${p.id}/48/48`}
                alt={p.name}
                className="search-bar__thumb"
                loading="lazy"
              />
              <div className="search-bar__item-info">
                <span className="search-bar__item-name">{p.name}</span>
                <span className="search-bar__item-meta">
                  {p.brand} · {p.category}
                </span>
              </div>
              <span className={`search-bar__item-stock ${p.inStock ? '' : 'search-bar__item-stock--out'}`}>
                {p.inStock ? '✅' : '❌'}
              </span>
            </li>
          ))}
          <li className="search-bar__see-all" onMouseDown={handleSubmit}>
            See all results for "<strong>{query}</strong>" →
          </li>
        </ul>
      )}

      {open && query.length >= 2 && results.length === 0 && (
        <div className="search-bar__no-results">No products found for "{query}"</div>
      )}
    </div>
  );
};

const Header = ({ overlay = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { href: whatsappHref, label: whatsappLabel } = useWhatsappSettings();

  return (
    <header className={`header ${overlay ? 'header--overlay' : ''}`}>
      { }
      <div className="header__topbar">
        <div className="header__topbar-inner container">
          <a href="tel:+919845012345" className="header__topbar-link">📞 +91 98450 12345</a>
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="header__topbar-link header__topbar-link--whatsapp">💬 {whatsappLabel}</a>
          <a href="mailto:info@intamsolutions.com" className="header__topbar-link">✉ info@intamsolutions.com</a>
        </div>
      </div>

      { }
      <div className="header__shell container mx-auto mt-3 flex items-center justify-between rounded-[22px] border border-white/80 bg-white/90 px-4 py-3 shadow-soft backdrop-blur-xl md:mt-4 md:px-6">
        <div className="header__main">
          { }
          <a href="/" className="header__logo">
            <svg className="header__logo-img" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="10" fill="#1e3a8a" />
              <path d="M24 8L10 14v10c0 8.4 5.9 16.3 14 18 8.1-1.7 14-9.6 14-18V14L24 8z" fill="#3b82f6" />
              <path d="M20 24l3 3 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="header__logo-text">
              <span className="header__logo-name">INTAM</span>
              <span className="header__logo-sub">SOLUTIONS</span>
              <span className="header__logo-tagline">Smart Security. Intelligent Automation.</span>
            </div>
          </a>

          { }
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
                    {link.children && <ChevronDown size={13} className="header__nav-arrow" aria-hidden="true" />}
                  </a>
                  {link.children && openDropdown === link.label && (
                    <ul className="header__dropdown">
                      {link.children.map((child) => (
                        <li key={child} className="header__dropdown-item">
                          <a href={`${link.href}/${child.toLowerCase().replace(/ /g, '-')}`}>{child}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          { }
          <div className="header__actions">
            { }
            <div className="header__search-desktop">
              <SearchBar />
            </div>


            <button
              className="header__hamburger"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        { }
        {menuOpen && (
          <nav className="header__mobile-menu container">
            <div className="header__search-mobile">
              <SearchBar />
            </div>
            <ul>
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
