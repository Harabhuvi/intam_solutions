const router = require('express').Router();
const Product = require('../models/Product');
const cache = require('../config/redis');
const { buildProductFilter } = require('../utils/queryHelpers');
const { paginateModel } = require('../utils/pagination');
const { authenticate } = require('../middleware/auth');
const { validate, productSchema } = require('../middleware/validate');

router.get('/', async (req, res, next) => {
  try {
    const { category, search, inStock, cursor, page, limit = 20 } = req.query;
    const parsedInStock = inStock === 'true' ? true : inStock === 'false' ? false : undefined;
    const filter = buildProductFilter({ category, search, inStock: parsedInStock });

    const result = await paginateModel(Product, filter, { page, cursor, limit });
    return res.json({ success: true, ...result });
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ success: false, error: 'Product not found.' });
    return res.json({ success: true, data: product });
  } catch (err) {
    return next(err);
  }
});

router.post('/', authenticate, validate(productSchema), async (req, res, next) => {
  try {
    const product = await new Product(req.body).save();
    await cache.del('dashboard:summary');
    return res.status(201).json({ success: true, data: product });
  } catch (err) {
    return next(err);
  }
});

router.put('/:id', authenticate, validate(productSchema), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!product) return res.status(404).json({ success: false, error: 'Product not found.' });
    await cache.del('dashboard:summary');
    return res.json({ success: true, data: product });
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id', authenticate, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();
    if (!product) return res.status(404).json({ success: false, error: 'Product not found.' });
    await cache.del('dashboard:summary');
    return res.json({ success: true, data: product });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found.' });
    await cache.del('dashboard:summary');
    return res.json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
