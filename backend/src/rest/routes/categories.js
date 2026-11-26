const router = require('express').Router();
const Category = require('../../models/Category');
const cache = require('../../config/redis');
const { authenticate } = require('../middleware/auth');
const { validate, categorySchema } = require('../middleware/validate');

router.get('/', async (_req, res, next) => {
  try {
    const { data, cacheHit, source } = await cache.getOrSet('dashboard:categories', 300, () =>
      Category.find().sort({ name: 1 }).lean()
    );
    res.json({ success: true, data, meta: { cacheHit, source } });
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).lean();
    if (!category) return res.status(404).json({ success: false, error: 'Category not found.' });
    res.json({ success: true, data: category });
  } catch (err) { next(err); }
});

router.post('/', authenticate, validate(categorySchema), async (req, res, next) => {
  try {
    const category = await new Category(req.body).save();
    await cache.del('dashboard:categories', 'dashboard:summary');
    res.status(201).json({ success: true, data: category });
  } catch (err) { next(err); }
});

router.put('/:id', authenticate, validate(categorySchema), async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
    if (!category) return res.status(404).json({ success: false, error: 'Category not found.' });
    await cache.del('dashboard:categories', 'dashboard:summary');
    res.json({ success: true, data: category });
  } catch (err) { next(err); }
});

router.patch('/:id', authenticate, async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true }).lean();
    if (!category) return res.status(404).json({ success: false, error: 'Category not found.' });
    await cache.del('dashboard:categories', 'dashboard:summary');
    res.json({ success: true, data: category });
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, error: 'Category not found.' });
    await cache.del('dashboard:categories', 'dashboard:summary');
    res.json({ success: true, message: 'Category deleted.' });
  } catch (err) { next(err); }
});

module.exports = router;
