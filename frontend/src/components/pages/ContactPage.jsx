import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_FOOTER_CONTENT, SUBMIT_CONTACT } from '../../graphql/queries';
import useWhatsappSettings from '../../hooks/useWhatsappSettings';
import Header from './Header';
import Footer from './Footer';
import '../style/ContactPage.css';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitContact, { loading }] = useMutation(SUBMIT_CONTACT);
  const { href: whatsappHref } = useWhatsappSettings();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitContact({ variables: form });
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      alert('Submission failed. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <main className="contact-page section">
        <div className="container">
          { }
          <div className="cp__header">
            <h1 className="cp__title">Contact Us</h1>
            <p className="cp__sub">
              Have a question or need a custom security solution? Send us a message and our team will get back to you within 24 hours.
            </p>
          </div>

          <div className="cp__grid">
            { }
            <div className="cp__info">
              <div className="cp__info-card">
                <span className="cp__info-icon">📞</span>
                <div>
                  <h3 className="cp__info-title">Call Us</h3>
                  <a href="tel:+919845012345" className="cp__info-link">+91 98450 12345</a>
                  <p className="cp__info-note">Mon – Sat, 9 AM – 6 PM</p>
                </div>
              </div>

              <div className="cp__info-card">
                <span className="cp__info-icon">✉️</span>
                <div>
                  <h3 className="cp__info-title">Email Us</h3>
                  <a href="mailto:info@intamsolutions.com" className="cp__info-link">info@intamsolutions.com</a>
                  <p className="cp__info-note">We reply within 24 hours</p>
                </div>
              </div>

              <div className="cp__info-card">
                <span className="cp__info-icon">💬</span>
                <div>
                  <h3 className="cp__info-title">WhatsApp</h3>
                  <a href={whatsappHref} target="_blank" rel="noreferrer" className="cp__info-link">
                    Chat on WhatsApp
                  </a>
                  <p className="cp__info-note">Quick responses</p>
                </div>
              </div>

              <div className="cp__info-card">
                <span className="cp__info-icon">📍</span>
                <div>
                  <h3 className="cp__info-title">Visit Us</h3>
                  <p className="cp__info-link">Coimbatore, Tamil Nadu, India</p>
                  <p className="cp__info-note">Site visits available on request</p>
                </div>
              </div>
            </div>

            { }
            <div className="cp__form-wrap">
              <h2 className="cp__form-heading">Send Us a Message</h2>

              {submitted ? (
                <div className="cp__success">
                  <span className="cp__success-icon">✅</span>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. Our team will get back to you shortly.</p>
                  <button
                    className="btn btn--primary"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="cp__form" onSubmit={handleSubmit} noValidate>
                  <div className="cp__form-row">
                    <div className="cp__field">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="cp__field">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="cp__field">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98450 12345"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="cp__field">
                    <label htmlFor="message">Your Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Tell us about your requirements…"
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn--primary cp__submit" disabled={loading}>
                    {loading ? 'Sending…' : 'Send Message →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;
