import React, { useState } from 'react';
import useWhatsappSettings from '../../hooks/useWhatsappSettings';
import '../style/WhatsAppFAB.css';

const WhatsAppFAB = () => {
  const [open, setOpen] = useState(false);
  const { href } = useWhatsappSettings();

  return (
    <div className={`wa-fab ${open ? 'wa-fab--open' : ''}`}>
      {open && (
        <div className="wa-fab__card">
          <div className="wa-fab__card-header">
            <span className="wa-fab__card-icon">💬</span>
            <div>
              <p className="wa-fab__card-title">Intam Solutions</p>
              <p className="wa-fab__card-sub">Typically replies instantly</p>
            </div>
            <button className="wa-fab__card-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
          </div>
          <div className="wa-fab__card-body">
            <p>Hi! 👋 How can we help you today?</p>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="wa-fab__card-btn"
            onClick={() => setOpen(false)}
          >
            Start Chat →
          </a>
        </div>
      )}

      <button
        className="wa-fab__btn"
        onClick={() => setOpen(!open)}
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="wa-fab__icon">
          <circle cx="16" cy="16" r="16" fill="#25d366"/>
          <path d="M22.5 9.5A9.1 9.1 0 0 0 7.1 20.6L6 26l5.6-1.1a9.1 9.1 0 0 0 10.9-15.4z" fill="#fff"/>
          <path d="M12.5 11.5c-.3-.6-.6-.6-.9-.6h-.8c-.3 0-.7.1-1 .5-.4.4-1.4 1.3-1.4 3.2s1.4 3.7 1.6 4c.2.2 2.8 4.4 6.9 6 1 .4 1.7.6 2.3.8.9.3 1.8.2 2.4.1.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.2-.4-.3-.8-.5s-2.3-1.1-2.6-1.3c-.3-.1-.6-.1-.9.3-.3.4-1 1.3-1.3 1.6-.2.3-.5.3-.9.1-.4-.2-1.8-.7-3.4-2.1-1.3-1.1-2.1-2.5-2.4-2.9-.2-.4 0-.6.2-.8l.6-.7c.2-.2.3-.4.4-.7.1-.3 0-.6-.1-.9l-1.6-3.5z" fill="#25d366"/>
        </svg>
        {!open && <span className="wa-fab__pulse" />}
      </button>
    </div>
  );
};

export default WhatsAppFAB;
