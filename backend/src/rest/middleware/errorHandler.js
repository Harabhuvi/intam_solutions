const errorHandler = (err, _req, res, _next) => {
  console.error('[REST Error]', err.message);
  const status = err.status ?? 500;
  res.status(status).json({ success: false, error: err.message ?? 'Internal server error.' });
};

module.exports = errorHandler;
