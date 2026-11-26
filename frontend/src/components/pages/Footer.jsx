import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_FOOTER_CONTENT } from '../../graphql/queries';
import '../style/Footer.css';

const DEFAULT_FOOTER = {
  brandName: 'INTAM SOLUTIONS', tagline: 'Smart Security. Intelligent Automation.',
  brandDescription: 'Providing top-tier electronic security and automation solutions across residential, commercial, and industrial spaces.',
  quickLinksTitle: 'Quick Links',
  quickLinks: [
    { label: 'Home', href: '/' }, { label: 'Products', href: '/products' },
    { label: 'Solutions', href: '/solutions' }, { label: 'Brands', href: '/brands' },
    { label: 'Contact', href: '/contact' },
  ],
  servicesTitle: 'Services',
  serviceLinks: [
    { label: 'Projects', href: '/projects' }, { label: 'Services & AMC', href: '/services' },
    { label: 'About Us', href: '/about' }, { label: 'Contact', href: '/contact' },
  ],
  contactTitle: 'Contact Us', phone: '+91 98450 12345', phoneHref: 'tel:+919845012345',
  email: 'info@intamsolutions.com', emailHref: 'mailto:info@intamsolutions.com',
  address: 'Coimbatore, Tamil Nadu',
  socialLinks: [
    { label: 'Facebook', href: '#facebook', icon: 'f' },
    { label: 'LinkedIn', href: '#linkedin', icon: 'in' },
    { label: 'YouTube', href: '#youtube', icon: '▶' },
  ],
  copyrightText: 'Intam Solutions. All rights reserved.',
};

const Footer = () => {
  const { data } = useQuery(GET_FOOTER_CONTENT);
  const content = { ...DEFAULT_FOOTER, ...data?.footerContent };
  const quickLinks = content.quickLinks;
  const serviceLinks = content.serviceLinks;
  const socialLinks = content.socialLinks;

  return (
    <footer className="footer">
      <div className="footer__main container">
        <div className="footer__col footer__col--brand">
          <a href="/" className="footer__logo-link">
            <svg className="footer__logo" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="48" height="48" rx="10" fill="#1e3a8a" />
              <path d="M24 8L10 14v10c0 8.4 5.9 16.3 14 18 8.1-1.7 14-9.6 14-18V14L24 8z" fill="#3b82f6" />
              <path d="M20 24l3 3 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <span className="footer__brand-name">{content.brandName}</span>
              <span className="footer__brand-tag">{content.tagline}</span>
            </div>
          </a>
          <p className="footer__brand-desc">{content.brandDescription}</p>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">{content.quickLinksTitle}</h4>
          <ul className="footer__links">{quickLinks.map((link, index) => <li key={`${link.href}-${index}`}><a href={link.href}>{link.label}</a></li>)}</ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">{content.servicesTitle}</h4>
          <ul className="footer__links">{serviceLinks.map((link, index) => <li key={`${link.href}-${index}`}><a href={link.href}>{link.label}</a></li>)}</ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">{content.contactTitle}</h4>
          <ul className="footer__contact-list">
            {content.phone && <li>📞 <a href={content.phoneHref}>{content.phone}</a></li>}
            {content.email && <li>✉ <a href={content.emailHref}>{content.email}</a></li>}
            {content.address && <li>📍 {content.address}</li>}
          </ul>
          <div className="footer__social">{socialLinks.map((link, index) => <a key={`${link.href}-${index}`} href={link.href} aria-label={link.label} className="footer__social-icon" target="_blank" rel="noreferrer">{link.icon}</a>)}</div>
        </div>
      </div>

      <div className="footer__bottom"><div className="container"><p>© {new Date().getFullYear()} {content.copyrightText}</p></div></div>
    </footer>
  );
};

export default Footer;
