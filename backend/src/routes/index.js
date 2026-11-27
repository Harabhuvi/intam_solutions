const router = require('express').Router();
const cache = require('../config/redis');
const { errorHandler } = require('../middleware/errorHandler');

router.use('/products', require('./product.routes'));
router.use('/categories', require('./category.routes'));
router.use('/orders', require('./order.routes'));
router.use('/users', require('./user.routes'));
router.use('/admin', require('./admin.routes'));
router.use('/', require('./settings.routes'));

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    cache: cache.getStatus(),
    timestamp: new Date().toISOString(),
  });
});

router.use(errorHandler);

module.exports = router;
