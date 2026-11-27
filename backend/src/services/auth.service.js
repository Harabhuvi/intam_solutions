const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

const ALGORITHM = 'HS256';
const SALT_ROUNDS = 12;

const hashPassword = (plain) => bcrypt.hash(plain, SALT_ROUNDS);
const verifyPassword = (plain, hash) => bcrypt.compare(plain, hash);

const generateToken = (admin) =>
  jwt.sign(
    { id: String(admin._id), email: admin.email, role: admin.role },
    jwtSecret,
    { algorithm: ALGORITHM, expiresIn: jwtExpiresIn }
  );

const getAdminFromToken = (req) => {
  const auth = req?.headers?.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(auth.slice(7), jwtSecret, { algorithms: [ALGORITHM] });
  } catch {
    return null;
  }
};

module.exports = { hashPassword, verifyPassword, generateToken, getAdminFromToken };