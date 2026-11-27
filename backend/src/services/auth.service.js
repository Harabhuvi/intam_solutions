const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

/**
 * Generates a signed JWT for an authenticated admin.
 */
const generateToken = (admin) =>
  jwt.sign(
    { id: admin._id, email: admin.email, role: admin.role },
    jwtSecret,
    { expiresIn: '7d' }
  );

/**
 * Extracts and verifies the admin payload from a Bearer Authorization header.
 */
const getAdminFromToken = (req) => {
  const auth = req?.headers?.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(auth.slice(7), jwtSecret);
  } catch {
    return null;
  }
};

const requireAdmin = (admin) => {
  if (!admin) throw new Error('UNAUTHORIZED: Admin login required');
};

module.exports = { generateToken, getAdminFromToken, requireAdmin };
