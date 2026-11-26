const router = require('express').Router();
const cache = require('../config/redis');
const errorHandler = require('./middleware/errorHandler');

router.use('/products',   require('./routes/products'));
router.use('/categories', require('./routes/categories'));
router.use('/orders',     require('./routes/orders'));
router.use('/users',      require('./routes/users'));
router.use('/admin',      require('./routes/admin'));

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
