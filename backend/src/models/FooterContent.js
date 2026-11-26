const mongoose = require('mongoose');

const { whatsappHref } = require('../config/whatsapp');
const contactDefaults = require('../config/contactDefaults');

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
  whatsappHref: { type: String, default: whatsappHref },
  brandName: { type: String, default: 'INTAM SOLUTIONS' },
  tagline: { type: String, default: 'Smart Security. Intelligent Automation.' },
  brandDescription: { type: String, default: 'Providing top-tier electronic security and automation solutions across residential, commercial, and industrial spaces.' },
  quickLinksTitle: { type: String, default: 'Quick Links' },
  quickLinks: { type: [linkSchema], default: [] },
  servicesTitle: { type: String, default: 'Services' },
  serviceLinks: { type: [linkSchema], default: [] },
  contactTitle: { type: String, default: contactDefaults.contactTitle },
  phone: { type: String, default: contactDefaults.phone },
  phoneHref: { type: String, default: contactDefaults.phoneHref },
  email: { type: String, default: contactDefaults.email },
  emailHref: { type: String, default: contactDefaults.emailHref },
  address: { type: String, default: contactDefaults.address },
  socialLinks: { type: [socialLinkSchema], default: () => contactDefaults.socialLinks.map((link) => ({ ...link })) },
  copyrightText: { type: String, default: 'Intam Solutions. All rights reserved.' },
}, { timestamps: true });

module.exports = mongoose.model('FooterContent', footerContentSchema);
