const { getAdminFromToken } = require('../../config/auth');

const authenticate = (req, res, next) => {
  const admin = getAdminFromToken(req);
  if (!admin) return res.status(401).json({ success: false, error: 'Admin login required.' });
  req.admin = admin;
  next();
};

module.exports = { authenticate };
