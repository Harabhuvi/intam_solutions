const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema(
  { label: { type: String, trim: true, required: true }, href: { type: String, trim: true, required: true } },
  { _id: false }
);

const socialLinkSchema = new mongoose.Schema(
  { label: { type: String, trim: true, required: true }, href: { type: String, trim: true, required: true }, icon: { type: String, trim: true, default: '' } },
  { _id: false }
);

const footerContentSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  ctaTitle: { type: String, default: 'Looking for the right security solution?' },
  ctaDescription: { type: String, default: 'Tell us about your requirements. Our team can help you select suitable products and arrange a site visit or quotation.' },
  ctaContactLabel: { type: String, default: 'Contact Us' },
  ctaContactHref: { type: String, default: '/contact' },
  whatsappLabel: { type: String, default: 'WhatsApp' },
  whatsappHref: { type: String, default: 'https://wa.me/919845012345' },
  brandName: { type: String, default: 'INTAM SOLUTIONS' },
  tagline: { type: String, default: 'Smart Security. Intelligent Automation.' },
  brandDescription: { type: String, default: 'Providing top-tier electronic security and automation solutions across residential, commercial, and industrial spaces.' },
  quickLinksTitle: { type: String, default: 'Quick Links' },
  quickLinks: { type: [linkSchema], default: [] },
  servicesTitle: { type: String, default: 'Services' },
  serviceLinks: { type: [linkSchema], default: [] },
  contactTitle: { type: String, default: 'Contact Us' },
  phone: { type: String, default: '+91 98450 12345' },
  phoneHref: { type: String, default: 'tel:+919845012345' },
  email: { type: String, default: 'info@intamsolutions.com' },
  emailHref: { type: String, default: 'mailto:info@intamsolutions.com' },
  address: { type: String, default: 'Coimbatore, Tamil Nadu' },
  socialLinks: { type: [socialLinkSchema], default: [] },
  copyrightText: { type: String, default: 'Intam Solutions. All rights reserved.' },
}, { timestamps: true });

module.exports = mongoose.model('FooterContent', footerContentSchema);
