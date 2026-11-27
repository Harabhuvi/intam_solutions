const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const isProd = process.env.NODE_ENV === 'production';

const parseCsvList = (value = '') =>
  value
    .split(',')
    .map((item) => item.trim().replace(/\/$/, ''))
    .filter(Boolean);

const whatsappNumber = String(process.env.WHATSAPPNUMBER || '').replace(/\D/g, '');
if (whatsappNumber && !/^\d{8,15}$/.test(whatsappNumber)) {
  throw new Error('WHATSAPPNUMBER must contain 8 to 15 digits in international format.');
}

const normalizeJwtExpiresIn = (value = '7d') => {
  const trimmed = String(value).trim();
  if (!trimmed) return '7d';
  if (/^\d+$/.test(trimmed)) return `${trimmed}d`;
  return trimmed;
};

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd,
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: normalizeJwtExpiresIn(process.env.JWT_EXPIRES_IN),
  allowedOrigins: parseCsvList(process.env.CLIENT_URL),
  whatsappNumber,
  whatsappHref: whatsappNumber ? `https://wa.me/${whatsappNumber}` : '',
};
