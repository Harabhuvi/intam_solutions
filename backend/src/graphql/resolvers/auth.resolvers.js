const Admin = require('../../models/Admin');
const { generateToken } = require('../../services/auth.service');
const { createAttemptTracker } = require('../../utils/attemptTracker');
const { fail, requireAuthenticatedAdmin, wrapResolvers } = require('./resolverUtils');

const loginAttempts = createAttemptTracker({ windowMs: 15 * 60 * 1000, max: 5 });

module.exports = wrapResolvers({
  Admin: {
    id: (admin) => String(admin._id || admin.id),
  },
  Query: {
    adminProfile: async (_, __, { admin }) => {
      requireAuthenticatedAdmin(admin);
      return Admin.findById(admin.id).select('-password').lean();
    },
  },
  Mutation: {
    adminLogin: async (_, { email, password }, context) => {
      const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
      if (!normalizedEmail || !password) fail('Invalid credentials.', 'UNAUTHENTICATED');

      const clientIp = context?.req?.ip || 'unknown';
      const attemptKey = `${clientIp}:${normalizedEmail}`;
      if (loginAttempts.isBlocked(attemptKey)) {
        fail('Too many failed login attempts. Please try again later.', 'TOO_MANY_REQUESTS');
      }

      const admin = await Admin.findOne({ email: normalizedEmail, isActive: true });
      if (!admin || !(await admin.matchPassword(password))) {
        loginAttempts.record(attemptKey);
        fail('Invalid credentials.', 'UNAUTHENTICATED');
      }

      loginAttempts.reset(attemptKey);
      admin.lastLogin = new Date();
      await admin.save();
      return { token: generateToken(admin), admin };
    },
  },
});
