const ContactQuery = require('../models/ContactQuery');
const cache = require('../config/redis');
const { sendEnquiryNotification, sendCustomerAutoReply } = require('./mailer.service');

const CACHE_KEYS = ['dashboard:enquiryStats', 'dashboard:summary'];
const invalidateEnquiryCache = async () => {
  try {
    await cache.del(...CACHE_KEYS);
  } catch (error) {
    console.error('Cache invalidation failed:', error?.message || error);
  }
};

const createEnquiry = async (input) => {
  const enquiry = await new ContactQuery(input).save();
  await invalidateEnquiryCache();

  Promise.allSettled([
    sendEnquiryNotification(input),
    sendCustomerAutoReply(input),
  ]).then((results) => {
    results
      .filter((result) => result.status === 'rejected')
      .forEach(({ reason }) => {
        console.error('Contact notification email failed:', reason?.message || reason);
      });
  });

  return enquiry;
};

const getEnquiryStats = async () => {
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
};

// Returns null when the enquiry doesn't exist
const updateEnquiryStatus = async (id, status) => {
  const enquiry = await ContactQuery.findByIdAndUpdate(
    id, { status }, { new: true, runValidators: true }
  );
  if (enquiry) await invalidateEnquiryCache();
  return enquiry;
};

// Returns false when the enquiry doesn't exist
const deleteEnquiry = async (id) => {
  const enquiry = await ContactQuery.findByIdAndDelete(id);
  if (enquiry) await invalidateEnquiryCache();
  return Boolean(enquiry);
};

module.exports = {
  createEnquiry,
  getEnquiryStats,
  updateEnquiryStatus,
  deleteEnquiry,
  invalidateEnquiryCache,
};