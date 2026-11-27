const rateLimit = require('express-rate-limit');

const createLimiter = (limit, windowMs = 15 * 60 * 1000) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' },
  });

const graphqlLimiter = createLimiter(300);
const adminRestLimiter = createLimiter(50);

module.exports = { graphqlLimiter, adminRestLimiter };
