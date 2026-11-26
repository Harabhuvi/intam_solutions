const router = require('express').Router();
const ContactQuery = require('../../models/ContactQuery');
const cache = require('../../config/redis');
const { buildEnquiryFilter, paginateWithCursor } = require('../../utils/queryHelpers');
const { authenticate } = require('../middleware/auth');
const { sendEnquiryNotification, sendCustomerAutoReply } = require('../../config/mailer');

const STATUSES = ['pending', 'resolved', 'in-progress'];

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { status, search, cursor, page, limit = 20 } = req.query;
    if (status && status !== 'all' && !STATUSES.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status.' });
    }
    const filter = buildEnquiryFilter({ status, search });

    if (page && !cursor) {
      const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
      const safePage = Math.max(Number(page) || 1, 1);
      const skip = (safePage - 1) * safeLimit;
      const [orders, total] = await Promise.all([
        ContactQuery.find(filter).sort({ createdAt: -1, _id: -1 }).skip(skip).limit(safeLimit).lean(),
        ContactQuery.countDocuments(filter),
      ]);
      return res.json({
        success: true,
        data: orders,
        meta: { total, page: safePage, limit: safeLimit, pages: Math.ceil(total / safeLimit) },
      });
    }

    const { items, pageInfo } = await paginateWithCursor(ContactQuery, filter, { cursor, limit });
    res.json({ success: true, data: items, pageInfo });
  } catch (err) { next(err); }
});

router.get('/stats', authenticate, async (_req, res, next) => {
  try {
    const { data, cacheHit, source } = await cache.getOrSet('dashboard:enquiryStats', 60, async () => {
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
    res.json({ success: true, data, meta: { cacheHit, source } });
  } catch (err) { next(err); }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await ContactQuery.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ success: false, error: 'Enquiry not found.' });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, error: 'name, email, and message are required.' });
    }
    const order = await new ContactQuery({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim(),
      message: message.trim(),
    }).save();
    await cache.del('dashboard:enquiryStats', 'dashboard:summary');
    Promise.allSettled([
      sendEnquiryNotification({ name, email, phone, message }),
      sendCustomerAutoReply({ name, email, phone, message }),
    ]).then((results) => {
      results.filter(r => r.status === 'rejected').forEach(({ reason }) => {
        console.error('Email notification failed:', reason?.message);
      });
    });
    res.status(201).json({ success: true, data: order });
  } catch (err) { next(err); }
});

router.patch('/:id/status', authenticate, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!STATUSES.includes(status)) return res.status(400).json({ success: false, error: 'Invalid status.' });
    const order = await ContactQuery.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }).lean();
    if (!order) return res.status(404).json({ success: false, error: 'Enquiry not found.' });
    await cache.del('dashboard:enquiryStats', 'dashboard:summary');
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await ContactQuery.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: 'Enquiry not found.' });
    await cache.del('dashboard:enquiryStats', 'dashboard:summary');
    res.json({ success: true, message: 'Enquiry deleted.' });
  } catch (err) { next(err); }
});

module.exports = router;
