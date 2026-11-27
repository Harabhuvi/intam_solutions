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

/* Stroke icons (24x24 grid) so nothing depends on emoji rendering */
const ICON_PATHS = {
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  facebook: (
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  youtube: (
    <>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </>
  ),
};

const Icon = ({ name, size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {ICON_PATHS[name]}
  </svg>
);

const isExternal = (href = '') => /^https?:\/\//i.test(href);
const externalProps = (href) =>
  (isExternal(href) ? { target: '_blank', rel: 'noreferrer noopener' } : {});

/* "Smart Security. Intelligent Automation." -> ["Smart Security.", "Intelligent Automation."] */
const splitTagline = (tagline = '') => {
  const parts = (tagline.match(/[^.!?]+[.!?]?/g) || [tagline]).map((s) => s.trim()).filter(Boolean);
  return parts.length ? parts : [tagline];
};

const scrollToTop = () => {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
};

const Footer = () => {
  const { data } = useQuery(GET_FOOTER_CONTENT);
  const content = { ...DEFAULT_FOOTER, ...data?.footerContent };

  // Guard against null lists coming back from the API
  const quickLinks = Array.isArray(content.quickLinks) ? content.quickLinks : [];
  const serviceLinks = Array.isArray(content.serviceLinks) ? content.serviceLinks : [];
  const socialLinks = Array.isArray(content.socialLinks) ? content.socialLinks : [];
  const taglineLines = splitTagline(content.tagline);

  return (
    <footer className="footer">
      {/* Contact panel: the one memorable element, framed like a camera viewfinder */}
      <div className="container">
        <section className="footer__panel" aria-labelledby="footer-headline">
          <h2 id="footer-headline" className="footer__headline">
            {taglineLines.map((line) => <span key={line}>{line}</span>)}
          </h2>

          <div className="footer__contact">
            <p className="footer__contact-title">
              <span className="footer__dot" aria-hidden="true" />
              {content.contactTitle}
            </p>

            {content.phone && (
              <a className="footer__btn" href={content.phoneHref}>
                <Icon name="phone" />
                Call {content.phone}
              </a>
            )}

            <ul className="footer__contact-list">
              {content.email && (
                <li>
                  <Icon name="mail" />
                  <a href={content.emailHref}>{content.email}</a>
                </li>
              )}
              {content.address && (
                <li>
                  <Icon name="pin" />
                  <span>{content.address}</span>
                </li>
              )}
            </ul>
          </div>
        </section>
      </div>

      <div className="footer__main container">
        <div className="footer__col footer__col--brand">
          <a href="/" className="footer__logo-link" aria-label={`${content.brandName} home`}>
            <svg className="footer__logo" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="48" height="48" rx="10" fill="#1e3a8a" />
              <path d="M24 8L10 14v10c0 8.4 5.9 16.3 14 18 8.1-1.7 14-9.6 14-18V14L24 8z" fill="#3b82f6" />
              <path d="M20 24l3 3 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="footer__brand-name">{content.brandName}</span>
          </a>
          <p className="footer__brand-desc">{content.brandDescription}</p>

          {socialLinks.length > 0 && (
            <ul className="footer__social" aria-label="Social media">
              {socialLinks.map((link, index) => {
                const iconKey = String(link.label || '').toLowerCase();
                return (
                  <li key={`${link.href}-${index}`}>
                    <a
                      href={link.href}
                      aria-label={link.label}
                      className="footer__social-icon"
                      {...externalProps(link.href)}
                    >
                      {ICON_PATHS[iconKey] ? <Icon name={iconKey} /> : link.icon}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <nav className="footer__col" aria-label={content.quickLinksTitle}>
          <h3 className="footer__col-title">{content.quickLinksTitle}</h3>
          <ul className="footer__links">
            {quickLinks.map((link, index) => (
              <li key={`${link.href}-${index}`}><a href={link.href}>{link.label}</a></li>
            ))}
          </ul>
        </nav>

        <nav className="footer__col" aria-label={content.servicesTitle}>
          <h3 className="footer__col-title">{content.servicesTitle}</h3>
          <ul className="footer__links">
            {serviceLinks.map((link, index) => (
              <li key={`${link.href}-${index}`}><a href={link.href}>{link.label}</a></li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {new Date().getFullYear()} {content.copyrightText}</p>
          <button type="button" className="footer__top" onClick={scrollToTop}>
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;