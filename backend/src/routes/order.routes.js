const router = require('express').Router();
const ContactQuery = require('../models/ContactQuery');
const cache = require('../config/redis');
const { buildEnquiryFilter } = require('../utils/queryHelpers');
const { paginateModel } = require('../utils/pagination');
const { authenticate } = require('../middleware/auth');
const {
  ENQUIRY_STATUSES,
  ENQUIRY_CACHE_KEYS,
  createEnquiry,
  getEnquiryStats,
} = require('../services/enquiry.service');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { status, search, cursor, page, limit = 20 } = req.query;
    if (status && status !== 'all' && !ENQUIRY_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status.' });
    }
    const filter = buildEnquiryFilter({ status, search });
    const result = await paginateModel(ContactQuery, filter, { page, cursor, limit });
    return res.json({ success: true, ...result });
  } catch (err) {
    return next(err);
  }
});

router.get('/stats', authenticate, async (_req, res, next) => {
  try {
    const { data, cacheHit, source } = await getEnquiryStats();
    return res.json({ success: true, data, meta: { cacheHit, source } });
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await ContactQuery.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ success: false, error: 'Enquiry not found.' });
    return res.json({ success: true, data: order });
  } catch (err) {
    return next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, error: 'name, email, and message are required.' });
    }
    const order = await createEnquiry({ name, email, phone, message });
    return res.status(201).json({ success: true, data: order });
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id/status', authenticate, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!ENQUIRY_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status.' });
    }
    const order = await ContactQuery.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).lean();
    if (!order) return res.status(404).json({ success: false, error: 'Enquiry not found.' });
    await cache.del(...ENQUIRY_CACHE_KEYS);
    return res.json({ success: true, data: order });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await ContactQuery.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: 'Enquiry not found.' });
    await cache.del(...ENQUIRY_CACHE_KEYS);
    return res.json({ success: true, message: 'Enquiry deleted.' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
