const ContactQuery = require('../../models/ContactQuery');
const { buildEnquiryFilter } = require('../../utils/queryHelpers');
const { paginateWithCursor } = require('../../utils/pagination');
const { createAttemptTracker } = require('../../utils/attemptTracker');
const validators = require('../../utils/validators');
const enquiryService = require('../../services/enquiry.service');
const { fail, requireAuthenticatedAdmin, wrapResolvers } = require('./resolverUtils');

const submissionAttempts = createAttemptTracker({ windowMs: 60 * 60 * 1000, max: 5 });

const guard = (fn) => {
  try {
    return fn();
  } catch (error) {
    if (error instanceof validators.ValidationError) fail(error.message, error.code);
    throw error;
  }
};

module.exports = wrapResolvers({
  ContactQuery: {
    id: (enquiry) => String(enquiry._id || enquiry.id),
  },

  Query: {
    contactQueries: async (_, { status, search }, { admin }) => {
      requireAuthenticatedAdmin(admin);
      guard(() => validators.parseStatusFilter(status));
      const filter = buildEnquiryFilter({ status, search: validators.cleanSearch(search) });
      let query = ContactQuery.find(filter);
      if (filter?.$or) query = query.collation({ locale: 'en', strength: 2 });
      return query.sort({ createdAt: -1, _id: -1 }).limit(100).lean();
    },

    contactQueriesConnection: async (_, { status, search, after, limit }, { admin }) => {
      requireAuthenticatedAdmin(admin);
      guard(() => validators.parseStatusFilter(status));
      const filter = buildEnquiryFilter({ status, search: validators.cleanSearch(search) });
      return paginateWithCursor(ContactQuery, filter, {
        cursor: after,
        limit: validators.clampLimit(limit),
      });
    },

    contactQuery: async (_, { id }, { admin }) => {
      requireAuthenticatedAdmin(admin);
      const safeId = guard(() => validators.parseObjectId(id));
      return ContactQuery.findById(safeId).lean();
    },

    enquiryStats: async (_, __, { admin }) => {
      requireAuthenticatedAdmin(admin);
      return enquiryService.getEnquiryStats();
    },
  },

  Mutation: {
    submitContactQuery: async (_, args, { req }) => {
      const ipKey = req?.ip || 'unknown';
      if (submissionAttempts.isBlocked(ipKey)) {
        fail('Too many submissions. Please try again later.', 'TOO_MANY_REQUESTS');
      }
      const input = guard(() => validators.parseContactInput(args));
      submissionAttempts.record(ipKey);
      return enquiryService.createEnquiry(input);
    },

    updateEnquiryStatus: async (_, { id, status }, { admin }) => {
      requireAuthenticatedAdmin(admin);
      const safeId = guard(() => validators.parseObjectId(id));
      const safeStatus = guard(() => validators.parseStatus(status));
      const enquiry = await enquiryService.updateEnquiryStatus(safeId, safeStatus);
      if (!enquiry) fail('Enquiry not found.', 'NOT_FOUND');
      return enquiry;
    },

    deleteEnquiry: async (_, { id }, { admin }) => {
      requireAuthenticatedAdmin(admin);
      const safeId = guard(() => validators.parseObjectId(id));
      const deleted = await enquiryService.deleteEnquiry(safeId);
      if (!deleted) fail('Enquiry not found.', 'NOT_FOUND');
      return true;
    },
  },
});