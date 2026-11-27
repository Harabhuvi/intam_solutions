const router = require('express').Router();
const Admin = require('../models/Admin');
const { generateToken, getAdminFromToken } = require('../services/auth.service');
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

    return res.json({
      success: true,
      data: {
        token: generateToken(admin),
        admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      },
    });
  } catch (err) {
    return next(err);
  }
});

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password').lean();
    if (!admin) return res.status(404).json({ success: false, error: 'Admin not found.' });
    return res.json({ success: true, data: admin });
  } catch (err) {
    return next(err);
  }
});

router.get('/verify', (req, res) => {
  const admin = getAdminFromToken(req);
  if (!admin) return res.status(401).json({ success: false, valid: false });
  return res.json({
    success: true,
    valid: true,
    admin: { id: admin.id, email: admin.email, role: admin.role },
  });
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ success: false, error: 'name, email, and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const exists = await Admin.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ success: false, error: 'Admin with this email already exists.' });
    }

    const admin = await new Admin({ name: name.trim(), email: normalizedEmail, password, role }).save();
    return res.status(201).json({
      success: true,
      data: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id', authenticate, async (req, res, next) => {
  try {
    const { name, role, isActive } = req.body;
    const updates = {
      ...(name && { name }),
      ...(role && { role }),
      ...(isActive !== undefined && { isActive }),
    };
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password').lean();

    if (!admin) return res.status(404).json({ success: false, error: 'Admin not found.' });
    return res.json({ success: true, data: admin });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    if (String(req.params.id) === String(req.admin.id)) {
      return res.status(400).json({ success: false, error: 'Cannot delete your own account.' });
    }
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ success: false, error: 'Admin not found.' });
    return res.json({ success: true, message: 'Admin deleted.' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
