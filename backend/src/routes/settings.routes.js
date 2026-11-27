const router = require('express').Router();
const FooterContent = require('../models/FooterContent');
const { whatsappHref } = require('../config/env');
const { authenticate } = require('../middleware/auth');
const { adminRestLimiter } = require('../middleware/rateLimiter');

router.get('/settings/whatsapp', async (_req, res, next) => {
  try {
    const settings = await FooterContent.findOne({ key: 'main' })
      .select('whatsappLabel whatsappHref')
      .lean();
    res.set('Cache-Control', 'public, max-age=60');
    return res.json({
      label: settings?.whatsappLabel || 'WhatsApp',
      href: settings?.whatsappHref || whatsappHref,
    });
  } catch (error) {
    return next(error);
  }
});

router.put(
  '/admin/settings/whatsapp',
  adminRestLimiter,
  authenticate,
  async (req, res, next) => {
    try {
      const { label, phone } = req.body || {};
      const normalizedPhone = String(phone || '').replace(/\D/g, '');
      if (!label?.trim() || !/^\d{8,15}$/.test(normalizedPhone)) {
        return res.status(400).json({
          error: 'Provide a label and an international phone number with 8–15 digits.',
        });
      }

      const settings = await FooterContent.findOneAndUpdate(
        { key: 'main' },
        {
          $set: {
            whatsappLabel: label.trim(),
            whatsappHref: `https://wa.me/${normalizedPhone}`,
          },
          $setOnInsert: { key: 'main' },
        },
        { new: true, upsert: true, runValidators: true }
      )
        .select('whatsappLabel whatsappHref')
        .lean();

      res.set('Cache-Control', 'no-store');
      return res.json({ label: settings.whatsappLabel, href: settings.whatsappHref });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
