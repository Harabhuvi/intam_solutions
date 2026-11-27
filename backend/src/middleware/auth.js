const { getAdminFromToken } = require('../services/auth.service');


const authenticate = (req, res, next) => {
  try {
    const admin = getAdminFromToken(req);
    if (!admin) {
      return res.status(401).json({ success: false, error: 'Admin login required.' });
    }
    req.admin = admin;
    return next();
  } catch {
    return res.status(401).json({ success: false, error: 'Admin login required.' });
  }
};

module.exports = { authenticate };
