require('dotenv').config();
const FooterContent = require('../../models/FooterContent');
const cache = require('../../config/redis');
const { whatsappHref } = require('../../config/whatsapp');
const contactDefaults = require('../../config/contactDefaults');

const { fail, requireAuthenticatedAdmin, wrapResolvers } = require('../resolverUtils');

const FOOTER_KEY = 'main';
const WHATSAPP_HREF_RE = /^https:\/\/wa\.me\/\d{8,15}$/;

const defaultFooterContent = {
  ctaTitle: 'Looking for the right security solution?',
  ctaDescription: 'Tell us about your requirements. Our team can help you select suitable products and arrange a site visit or quotation.',
  ctaContactLabel: 'Contact Us',
  ctaContactHref: '/contact',
  whatsappLabel: 'WhatsApp',
  whatsappHref,
  brandName: 'INTAM SOLUTIONS',
  tagline: 'Smart Security. Intelligent Automation.',
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
  ...contactDefaults,
  copyrightText: 'Intam Solutions. All rights reserved.',
};

const assertSafeHref = (href, fieldName) => {
  if (href == null || href === '') return;
  const isSitePath = /^\/(?!\/)[^\s]*$/.test(href);
  const isWebUrl = /^https?:\/\/[^\s]+$/i.test(href);
  const isEmail = /^mailto:[^\s@]+@[^\s@]+$/i.test(href);
  const isPhone = /^tel:\+?[\d().\-\s]+$/i.test(href);
  const isAnchor = /^#[A-Za-z][\w-]*$/.test(href);
  if (!(isSitePath || isWebUrl || isEmail || isPhone || isAnchor)) {
    fail(`${fieldName} must be a valid http(s), mailto, tel, anchor, or site-relative URL.`);
  }
};

const validateFooterContent = (content) => {
  for (const [name, href] of [
    ['ctaContactHref', content.ctaContactHref],
    ['phoneHref', content.phoneHref],
    ['emailHref', content.emailHref],
  ]) assertSafeHref(href, name);

  if (content.whatsappHref && !WHATSAPP_HREF_RE.test(content.whatsappHref)) {
    fail('whatsappHref must be a WhatsApp link in the format https://wa.me/<international-number>.');
  }

  for (const [listName, links] of [
    ['quickLinks', content.quickLinks],
    ['serviceLinks', content.serviceLinks],
    ['socialLinks', content.socialLinks],
  ]) {
    for (const [index, link] of (links || []).entries()) {
      assertSafeHref(link.href, `${listName}[${index}].href`);
    }
  }
};

module.exports = wrapResolvers({
  Query: {
    footerContent: async () => {
      const { data } = await cache.getOrSet('dashboard:footerContent', 300, async () =>
        (await FooterContent.findOne({ key: FOOTER_KEY }).lean()) || defaultFooterContent
      );
      return data;
    },
  },
  Mutation: {
    updateFooterContent: async (_, { content }, { admin }) => {
      requireAuthenticatedAdmin(admin);
      validateFooterContent(content);
      const updated = await FooterContent.findOneAndUpdate(
        { key: FOOTER_KEY },
        { $set: content, $setOnInsert: { key: FOOTER_KEY } },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );
      await cache.del('dashboard:footerContent');
      return updated;
    },
  },
});
