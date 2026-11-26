const router = require('express').Router();
const Admin = require('../../models/Admin');
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const ContactQuery = require('../../models/ContactQuery');
const cache = require('../../config/redis');
const { profileAllQueries } = require('../../utils/queryProfiler');
const { generateToken, getAdminFromToken } = require('../../config/auth');
const { authenticate } = require('../middleware/auth');

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ success: false, error: 'email and password are required.' });
    }
    const admin = await Admin.findOne({ email: email.trim().toLowerCase(), isActive: true });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }
    admin.lastLogin = new Date();
    await admin.save();
    const token = generateToken(admin);
    res.json({
      success: true,
      data: {
        token,
        admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      },
    });
  } catch (err) { next(err); }
});

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password').lean();
    if (!admin) return res.status(404).json({ success: false, error: 'Admin not found.' });
    res.json({ success: true, data: admin });
  } catch (err) { next(err); }
});

router.get('/verify', (req, res) => {
  const admin = getAdminFromToken(req);
  if (!admin) return res.status(401).json({ success: false, valid: false });
  res.json({ success: true, valid: true, admin: { id: admin.id, email: admin.email, role: admin.role } });
});

router.get('/dashboard', authenticate, async (_req, res, next) => {
  try {
    const { data, cacheHit, source } = await cache.getOrSet('dashboard:summary', 60, async () => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const [totalEnquiries, pendingEnquiries, resolvedEnquiries, todayEnquiries, productCount, categoryCount, recentEnquiries] = await Promise.all([
        ContactQuery.countDocuments(),
        ContactQuery.countDocuments({ status: 'pending' }),
        ContactQuery.countDocuments({ status: 'resolved' }),
        ContactQuery.countDocuments({ createdAt: { $gte: startOfDay } }),
        Product.countDocuments(),
        Category.countDocuments(),
        ContactQuery.find().sort({ createdAt: -1, _id: -1 }).limit(5).lean(),
      ]);
      return {
        enquiryStats: {
          total: totalEnquiries,
          pending: pendingEnquiries,
          resolved: resolvedEnquiries,
          todayCount: todayEnquiries,
        },
        catalogStats: {
          products: productCount,
          categories: categoryCount,
        },
        recentEnquiries,
      };
    });
    res.json({
      success: true,
      data,
      meta: { cacheHit, source, cache: cache.getStatus() },
    });
  } catch (err) { next(err); }
});

router.get('/profile-queries', authenticate, async (_req, res, next) => {
  try {
    const profiles = await profileAllQueries();
    res.json({ success: true, data: profiles });
  } catch (err) { next(err); }
});

router.get('/', authenticate, async (_req, res, next) => {
  try {
    const admins = await Admin.find().select('-password').lean();
    res.json({ success: true, data: admins });
  } catch (err) { next(err); }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ success: false, error: 'name, email, and password are required.' });
    }
    const exists = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (exists) return res.status(409).json({ success: false, error: 'Admin with this email already exists.' });
    const admin = await new Admin({ name: name.trim(), email: email.trim().toLowerCase(), password, role }).save();
    res.status(201).json({ success: true, data: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) { next(err); }
});

router.patch('/:id', authenticate, async (req, res, next) => {
  try {
    const { name, role, isActive } = req.body;
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { $set: { ...(name && { name }), ...(role && { role }), ...(isActive !== undefined && { isActive }) } },
      { new: true, runValidators: true }
    ).select('-password').lean();
    if (!admin) return res.status(404).json({ success: false, error: 'Admin not found.' });
    res.json({ success: true, data: admin });
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    if (String(req.params.id) === String(req.admin.id)) {
      return res.status(400).json({ success: false, error: 'Cannot delete your own account.' });
    }
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ success: false, error: 'Admin not found.' });
    res.json({ success: true, message: 'Admin deleted.' });
  } catch (err) { next(err); }
});

module.exports = router;
