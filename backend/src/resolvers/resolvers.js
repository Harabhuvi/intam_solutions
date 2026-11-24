const Product      = require('../models/Product');
const Category     = require('../models/Category');
const ContactQuery = require('../models/ContactQuery');
const Admin        = require('../models/Admin');
const FooterContent = require('../models/FooterContent');
const { generateToken, requireAdmin } = require('../config/auth');
const { sendEnquiryNotification, sendCustomerAutoReply } = require('../config/mailer');

const defaultFooterContent = {
  ctaTitle: 'Looking for the right security solution?',
  ctaDescription: 'Tell us about your requirements. Our team can help you select suitable products and arrange a site visit or quotation.',
  ctaContactLabel: 'Contact Us', ctaContactHref: '/contact',
  whatsappLabel: 'WhatsApp', whatsappHref: 'https://wa.me/919845012345',
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

const isSafeFooterHref = (href) => /^(https?:\/\/|mailto:|tel:|#|\/(?!\/))/.test(href || '');

const resolvers = {
  Query: {
    /* ── Public ─────────────────────────────────────────── */
    products:            async () => await Product.find().sort({ createdAt: -1 }),
    product:             async (_, { id }) => await Product.findById(id),
    productsByCategory:  async (_, { category }) => await Product.find({ category }),
    categories:          async () => await Category.find(),
    category:            async (_, { slug }) => await Category.findOne({ slug }),
    footerContent: async () => {
      const content = await FooterContent.findOne({ key: 'main' }).lean();
      return content || defaultFooterContent;
    },

    /* ── Admin-protected ────────────────────────────────── */
    contactQueries: async (_, { status, search }, { admin }) => {
      requireAdmin(admin);
      const filter = {};
      if (status && status !== 'all') filter.status = status;
      if (search) {
        const re = new RegExp(search, 'i');
        filter.$or = [{ name: re }, { email: re }, { phone: re }, { message: re }];
      }
      return await ContactQuery.find(filter).sort({ createdAt: -1 });
    },

    contactQuery: async (_, { id }, { admin }) => {
      requireAdmin(admin);
      return await ContactQuery.findById(id);
    },

    enquiryStats: async (_, __, { admin }) => {
      requireAdmin(admin);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [total, pending, resolved, todayCount] = await Promise.all([
        ContactQuery.countDocuments(),
        ContactQuery.countDocuments({ status: 'pending' }),
        ContactQuery.countDocuments({ status: 'resolved' }),
        ContactQuery.countDocuments({ createdAt: { $gte: today } }),
      ]);
      return { total, pending, resolved, todayCount };
    },

    adminProfile: async (_, __, { admin }) => {
      requireAdmin(admin);
      return await Admin.findById(admin.id);
    },
  },

  Mutation: {
    /* ── Public product/category ────────────────────────── */
    addProduct: async (_, args, { admin }) => {
      requireAdmin(admin);
      return await new Product(args).save();
    },
    updateProduct: async (_, { id, ...args }, { admin }) => {
      requireAdmin(admin);
      const product = await Product.findByIdAndUpdate(id, args, { new: true, runValidators: true });
      if (!product) throw new Error('Product not found');
      return product;
    },
    deleteProduct: async (_, { id }, { admin }) => {
      requireAdmin(admin);
      const product = await Product.findByIdAndDelete(id);
      if (!product) throw new Error('Product not found');
      return true;
    },
    addCategory: async (_, args) => await new Category(args).save(),
    updateFooterContent: async (_, { content }, { admin }) => {
      requireAdmin(admin);
      const linkValues = [
        content.ctaContactHref, content.whatsappHref, content.phoneHref, content.emailHref,
        ...(content.quickLinks || []).map((link) => link.href),
        ...(content.serviceLinks || []).map((link) => link.href),
        ...(content.socialLinks || []).map((link) => link.href),
      ].filter(Boolean);
      if (linkValues.some((href) => !isSafeFooterHref(href))) {
        throw new Error('Footer links must use http(s), mailto, tel, #, or a site-relative URL');
      }
      return await FooterContent.findOneAndUpdate(
        { key: 'main' },
        { $set: content, $setOnInsert: { key: 'main' } },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );
    },

    submitContactQuery: async (_, args) => {
      const query = await new ContactQuery(args).save();
      // Send emails in background (don't block the GraphQL response)
      Promise.all([
        sendEnquiryNotification(args),
        sendCustomerAutoReply(args),
      ]).catch((err) => console.error('Email error:', err.message));
      return query;
    },

    /* ── Admin Auth ─────────────────────────────────────── */
    adminLogin: async (_, { email, password }) => {
      const admin = await Admin.findOne({ email: email.toLowerCase(), isActive: true });
      if (!admin) throw new Error('Invalid credentials');
      const ok = await admin.matchPassword(password);
      if (!ok)  throw new Error('Invalid credentials');
      admin.lastLogin = new Date();
      await admin.save();
      return { token: generateToken(admin), admin };
    },

    /* ── Admin enquiry management ───────────────────────── */
    updateEnquiryStatus: async (_, { id, status }, { admin }) => {
      requireAdmin(admin);
      const valid = ['pending', 'resolved', 'in-progress'];
      if (!valid.includes(status)) throw new Error('Invalid status value');
      const q = await ContactQuery.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      if (!q) throw new Error('Enquiry not found');
      return q;
    },

    deleteEnquiry: async (_, { id }, { admin }) => {
      requireAdmin(admin);
      await ContactQuery.findByIdAndDelete(id);
      return true;
    },
  },
};

module.exports = resolvers;
