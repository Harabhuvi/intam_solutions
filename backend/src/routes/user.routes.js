const router = require('express').Router();
const ContactQuery = require('../models/ContactQuery');
const { buildEnquiryFilter } = require('../utils/queryHelpers');
const { paginateModel } = require('../utils/pagination');
const { authenticate } = require('../middleware/auth');

const USER_PROJECTION = 'name email phone createdAt';

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { search, cursor, page, limit = 20 } = req.query;
    const filter = buildEnquiryFilter({ search });
    const result = await paginateModel(ContactQuery, filter, {
      page,
      cursor,
      limit,
      select: USER_PROJECTION,
    });
    return res.json({ success: true, ...result });
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const user = await ContactQuery.findById(req.params.id, USER_PROJECTION).lean();
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    return res.json({ success: true, data: user });
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id', authenticate, async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const updates = {
      ...(name && { name }),
      ...(email && { email }),
      ...(phone !== undefined && { phone }),
    };
    const user = await ContactQuery.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    return res.json({ success: true, data: user });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const user = await ContactQuery.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    return res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
