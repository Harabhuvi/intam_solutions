const ContactQuery = require('../models/ContactQuery');
const Admin = require('../models/Admin');
const cache = require('../config/redis');
const { generateToken } = require('../config/auth');
const { sendEnquiryNotification, sendCustomerAutoReply } = require('../config/mailer');
const { buildEnquiryFilter, paginateWithCursor } = require('../utils/queryHelpers');
const { profileAllQueries } = require('../utils/queryProfiler');
const { fail, requireAuthenticatedAdmin, wrapResolvers } = require('./resolverUtils');
const productResolvers = require('./products/productResolvers');
const footerResolvers = require('./footer/footerResolvers');

const ENQUIRY_STATUSES = new Set(['pending', 'resolved', 'in-progress']);

const enquiryResolvers = wrapResolvers({
  ContactQuery: {
    id: (enquiry) => String(enquiry._id || enquiry.id),
  },
  Admin: {
    id: (admin) => String(admin._id || admin.id),
  },
  Query: {
    contactQueries: async (_, { status, search }, { admin }) => {
      requireAuthenticatedAdmin(admin);
      if (status && status !== 'all' && !ENQUIRY_STATUSES.has(status)) {
        fail('Invalid enquiry status.');
      }
      const filter = buildEnquiryFilter({ status, search });
      return ContactQuery.find(filter).sort({ createdAt: -1, _id: -1 }).lean();
    },

    contactQueriesConnection: async (_, { status, search, after, limit }, { admin }) => {
      requireAuthenticatedAdmin(admin);
      if (status && status !== 'all' && !ENQUIRY_STATUSES.has(status)) {
        fail('Invalid enquiry status.');
      }
      const filter = buildEnquiryFilter({ status, search });
      return paginateWithCursor(ContactQuery, filter, { cursor: after, limit });
    },

    contactQuery: async (_, { id }, { admin }) => {
      requireAuthenticatedAdmin(admin);
      return ContactQuery.findById(id).lean();
    },

    enquiryStats: async (_, __, { admin }) => {
      requireAuthenticatedAdmin(admin);
      const { data } = await cache.getOrSet('dashboard:enquiryStats', 60, async () => {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const [total, pending, resolved, todayCount] = await Promise.all([
          ContactQuery.countDocuments(),
          ContactQuery.countDocuments({ status: 'pending' }),
          ContactQuery.countDocuments({ status: 'resolved' }),
          ContactQuery.countDocuments({ createdAt: { $gte: startOfDay } }),
        ]);
        return { total, pending, resolved, todayCount };
      });
      return data;
    },

    adminProfile: async (_, __, { admin }) => {
      requireAuthenticatedAdmin(admin);
      return Admin.findById(admin.id).select('-password').lean();
    },

    queryProfiles: async (_, __, { admin }) => {
      requireAuthenticatedAdmin(admin);
      return profileAllQueries();
    },
  },

  Mutation: {
    submitContactQuery: async (_, args) => {
      const query = await new ContactQuery({
        name: args.name.trim(),
        email: args.email.trim().toLowerCase(),
        phone: args.phone?.trim(),
        message: args.message.trim(),
      }).save();

      await cache.del('dashboard:enquiryStats', 'dashboard:summary');

      Promise.allSettled([
        sendEnquiryNotification(args),
        sendCustomerAutoReply(args),
      ]).then((results) => {
        results.filter((result) => result.status === 'rejected').forEach(({ reason }) => {
          console.error('Contact notification email failed:', reason?.message || reason);
        });
      });
      return query;
    },

    adminLogin: async (_, { email, password }) => {
      const normalizedEmail = email?.trim().toLowerCase();
      if (!normalizedEmail || !password) fail('Invalid credentials.', 'UNAUTHENTICATED');
      const admin = await Admin.findOne({ email: normalizedEmail, isActive: true });
      if (!admin || !(await admin.matchPassword(password))) {
        fail('Invalid credentials.', 'UNAUTHENTICATED');
      }
      admin.lastLogin = new Date();
      await admin.save();
      return { token: generateToken(admin), admin };
    },

    updateEnquiryStatus: async (_, { id, status }, { admin }) => {
      requireAuthenticatedAdmin(admin);
      if (!ENQUIRY_STATUSES.has(status)) fail('Invalid status value.');
      const enquiry = await ContactQuery.findByIdAndUpdate(
        id, { status }, { new: true, runValidators: true }
      );
      if (!enquiry) fail('Enquiry not found.', 'NOT_FOUND');
      await cache.del('dashboard:enquiryStats', 'dashboard:summary');
      return enquiry;
    },

    deleteEnquiry: async (_, { id }, { admin }) => {
      requireAuthenticatedAdmin(admin);
      const enquiry = await ContactQuery.findByIdAndDelete(id);
      if (!enquiry) fail('Enquiry not found.', 'NOT_FOUND');
      await cache.del('dashboard:enquiryStats', 'dashboard:summary');
      return true;
    },
  },
});

const mergeResolvers = (...resolverMaps) => resolverMaps.reduce((merged, resolverMap) => {
  for (const [typeName, fields] of Object.entries(resolverMap)) {
    merged[typeName] = { ...merged[typeName], ...fields };
  }
  return merged;
}, {});

module.exports = mergeResolvers(enquiryResolvers, productResolvers, footerResolvers);
