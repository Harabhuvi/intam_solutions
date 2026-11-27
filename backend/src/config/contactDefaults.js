const phone = process.env.CONTACT_PHONE?.trim();
const email = process.env.CONTACT_EMAIL?.trim().toLowerCase();

const contactDefaults = Object.freeze({
  contactTitle: process.env.CONTACT_TITLE?.trim(),
  phone,
  phoneHref: process.env.CONTACT_PHONE_HREF?.trim(),
  email,
  emailHref: process.env.CONTACT_EMAIL_HREF?.trim(),
  address: process.env.CONTACT_ADDRESS?.trim() || 'Coimbatore, Tamil Nadu',
  socialLinks: Object.freeze([
    { label: 'Facebook', href: process.env.FACEBOOK_URL?.trim(), icon: 'f' },
    { label: 'LinkedIn', href: process.env.LINKEDIN_URL?.trim(), icon: 'in' },
    { label: 'YouTube', href: process.env.YOUTUBE_URL?.trim(), icon: '▶' },
  ]),
});

module.exports = contactDefaults;
