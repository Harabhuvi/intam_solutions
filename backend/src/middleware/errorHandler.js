const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Centralized Express error-handling middleware.
 */
const errorHandler = (err, _req, res, _next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, error: 'Origin not allowed.' });
  }

  console.error('[Error]', err.message || err);
  const status = err.status || (err.name === 'ValidationError' || err.name === 'CastError' ? 400 : 500);
  const message = status === 500 ? 'Internal server error.' : err.message;

  return res.status(status).json({
    success: false,
    error: message || 'Internal server error.',
  });
};

module.exports = { notFound, errorHandler };
