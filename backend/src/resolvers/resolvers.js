const Product      = require('../models/Product');
const Category     = require('../models/Category');
const ContactQuery = require('../models/ContactQuery');
const Admin        = require('../models/Admin');
const { generateToken, requireAdmin } = require('../config/auth');
const { sendEnquiryNotification, sendCustomerAutoReply } = require('../config/mailer');

const resolvers = {
  Query: {
    /* ── Public ─────────────────────────────────────────── */
    products:            async () => await Product.find().sort({ createdAt: -1 }),
    product:             async (_, { id }) => await Product.findById(id),
    productsByCategory:  async (_, { category }) => await Product.find({ category }),
    categories:          async () => await Category.find(),
    category:            async (_, { slug }) => await Category.findOne({ slug }),

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
    addProduct:  async (_, args) => await new Product(args).save(),
    addCategory: async (_, args) => await new Category(args).save(),

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
