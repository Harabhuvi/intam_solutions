const router = require('express').Router();
const Product = require('../../models/Product');
const cache = require('../../config/redis');
const { buildProductFilter, paginateWithCursor } = require('../../utils/queryHelpers');
const { authenticate } = require('../middleware/auth');
const { validate, productSchema } = require('../middleware/validate');

router.get('/', async (req, res, next) => {
  try {
    const { category, search, inStock, cursor, page, limit = 20 } = req.query;
    const parsedInStock = inStock === 'true' ? true : inStock === 'false' ? false : undefined;
    const filter = buildProductFilter({ category, search, inStock: parsedInStock });

    if (page && !cursor) {
      const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
      const safePage = Math.max(Number(page) || 1, 1);
      const skip = (safePage - 1) * safeLimit;
      const [products, total] = await Promise.all([
        Product.find(filter).sort({ createdAt: -1, _id: -1 }).skip(skip).limit(safeLimit).lean(),
        Product.countDocuments(filter),
      ]);
      return res.json({
        success: true,
        data: products,
        meta: { total, page: safePage, limit: safeLimit, pages: Math.ceil(total / safeLimit) },
      });
    }

    const { items, pageInfo } = await paginateWithCursor(Product, filter, { cursor, limit });
    res.json({ success: true, data: items, pageInfo });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ success: false, error: 'Product not found.' });
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
});

router.post('/', authenticate, validate(productSchema), async (req, res, next) => {
  try {
    const product = await new Product(req.body).save();
    await cache.del('dashboard:summary');
    res.status(201).json({ success: true, data: product });
  } catch (err) { next(err); }
});

router.put('/:id', authenticate, validate(productSchema), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
    if (!product) return res.status(404).json({ success: false, error: 'Product not found.' });
    await cache.del('dashboard:summary');
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
});

router.patch('/:id', authenticate, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true }).lean();
    if (!product) return res.status(404).json({ success: false, error: 'Product not found.' });
    await cache.del('dashboard:summary');
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found.' });
    await cache.del('dashboard:summary');
    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) { next(err); }
});

module.exports = router;
