const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT for an admin user
 */
const generateToken = (admin) =>
  jwt.sign(
    { id: admin._id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

/**
 * Middleware: attach decoded admin to context if Authorization header present
 */
const getAdminFromToken = (req) => {
  const auth = req?.headers?.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(auth.slice(7), process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

/**
 * Guard helper — throws if not authenticated
 */
const requireAdmin = (admin) => {
  if (!admin) throw new Error('UNAUTHORIZED: Admin login required');
};

module.exports = { generateToken, getAdminFromToken, requireAdmin };
