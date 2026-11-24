import React from 'react';
import './Footer.css';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Brands', href: '/brands' },
  { label: 'Contact', href: '/contact' },
];

const serviceLinks = [
  { label: 'Projects', href: '/projects' },
  { label: 'Services & AMC', href: '/services' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const Footer = () => {
  return (
    <footer className="footer">
      {/* ── CTA Banner ─────────────────────────────────── */}
      <div className="footer__cta">
        <div className="footer__cta-inner container">
          <div>
            <p className="footer__cta-heading">Looking for the right security solution?</p>
            <p className="footer__cta-sub">
              Tell us about your requirements. Our team can help you select suitable products and arrange a site visit or quotation.
            </p>
          </div>
          <div className="footer__cta-btns">
            <a href="/contact" className="btn btn--primary">Request a Quote →</a>
            <a href="/contact" className="btn btn--outline-dark">Contact Us</a>
            <a
              href="https://wa.me/919845012345"
              className="btn btn--whatsapp"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Footer ────────────────────────────────── */}
      <div className="footer__main container">
        {/* Brand column */}
        <div className="footer__col footer__col--brand">
          <a href="/" className="footer__logo-link">
            <svg className="footer__logo" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="10" fill="#1e3a8a"/>
              <path d="M24 8L10 14v10c0 8.4 5.9 16.3 14 18 8.1-1.7 14-9.6 14-18V14L24 8z" fill="#3b82f6"/>
              <path d="M20 24l3 3 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <span className="footer__brand-name">INTAM SOLUTIONS</span>
              <span className="footer__brand-tag">Smart Security. Intelligent Automation.</span>
            </div>
          </a>
          <p className="footer__brand-desc">
            Providing top-tier electronic security and automation solutions across residential, commercial, and industrial spaces.
          </p>
        </div>

        {/* Quick links */}
        <div className="footer__col">
          <h4 className="footer__col-title">Quick Links</h4>
          <ul className="footer__links">
            {quickLinks.map((l) => (
              <li key={l.label}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="footer__col">
          <h4 className="footer__col-title">Services</h4>
          <ul className="footer__links">
            {serviceLinks.map((l) => (
              <li key={l.label}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer__col">
          <h4 className="footer__col-title">Contact Us</h4>
          <ul className="footer__contact-list">
            <li>📞 <a href="tel:+919845012345">+91 98450 12345</a></li>
            <li>✉ <a href="mailto:info@intamsolutions.com">info@intamsolutions.com</a></li>
            <li>📍 Coimbatore, Tamil Nadu</li>
          </ul>
          <div className="footer__social">
            <a href="#facebook" aria-label="Facebook" className="footer__social-icon">f</a>
            <a href="#linkedin" aria-label="LinkedIn" className="footer__social-icon">in</a>
            <a href="#youtube" aria-label="YouTube" className="footer__social-icon">▶</a>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ─────────────────────────────────── */}
      <div className="footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Intam Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
