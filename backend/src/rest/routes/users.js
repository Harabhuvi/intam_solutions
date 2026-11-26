const router = require('express').Router();
const ContactQuery = require('../../models/ContactQuery');
const { buildEnquiryFilter, paginateWithCursor } = require('../../utils/queryHelpers');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { search, cursor, page, limit = 20 } = req.query;
    const filter = buildEnquiryFilter({ search });
    const select = 'name email phone createdAt';

    if (page && !cursor) {
      const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
      const safePage = Math.max(Number(page) || 1, 1);
      const skip = (safePage - 1) * safeLimit;
      const [users, total] = await Promise.all([
        ContactQuery.find(filter, { name: 1, email: 1, phone: 1, createdAt: 1 })
          .sort({ createdAt: -1, _id: -1 }).skip(skip).limit(safeLimit).lean(),
        ContactQuery.countDocuments(filter),
      ]);
      return res.json({
        success: true,
        data: users,
        meta: { total, page: safePage, limit: safeLimit, pages: Math.ceil(total / safeLimit) },
      });
    }

    const { items, pageInfo } = await paginateWithCursor(ContactQuery, filter, { cursor, limit, select });
    res.json({ success: true, data: items, pageInfo });
  } catch (err) { next(err); }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const user = await ContactQuery.findById(req.params.id, { name: 1, email: 1, phone: 1, createdAt: 1 }).lean();
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

router.patch('/:id', authenticate, async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const user = await ContactQuery.findByIdAndUpdate(
      req.params.id,
      { $set: { ...(name && { name }), ...(email && { email }), ...(phone !== undefined && { phone }) } },
      { new: true, runValidators: true }
    ).lean();
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const user = await ContactQuery.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) { next(err); }
});

module.exports = router;
