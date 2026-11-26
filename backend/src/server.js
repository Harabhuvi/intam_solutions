require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const { ApolloServer }     = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');

const connectDB   = require('./config/db');
const seedAdmin   = require('./config/seedAdmin');
const typeDefs    = require('./schema/typeDefs');
const resolvers   = require('./resolvers/resolvers');
const { getAdminFromToken } = require('./config/auth');
const FooterContent = require('./models/FooterContent');
const { requireAdmin } = require('./config/auth');
const { whatsappHref } = require('./config/whatsapp');
const restRouter  = require('./rest');

const startServer = async () => {
  await connectDB();
  await seedAdmin();

  const app = express();

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const allowed = [
        /\.vercel\.app$/,
        /\.onrender\.com$/,
        /^https?:\/\/localhost/,
      ];
      if (allowed.some((re) => re.test(origin))) return callback(null, true);
      if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) return callback(null, true);
      callback(null, true);
    },
    credentials: true,
  }));
  app.use(bodyParser.json());
  app.use('/api', restRouter);
  app.get('/api/settings/whatsapp', async (_req, res, next) => {
    try {
      const settings = await FooterContent.findOne({ key: 'main' }).select('whatsappLabel whatsappHref').lean();
      res.set('Cache-Control', 'public, max-age=60');
      res.json({
        label: settings?.whatsappLabel || 'WhatsApp',
        href: settings?.whatsappHref || whatsappHref,
      });
    } catch (error) { next(error); }
  });

  app.put('/api/admin/settings/whatsapp', async (req, res) => {
    try {
      const admin = getAdminFromToken(req);
      requireAdmin(admin);
      const { label, phone } = req.body || {};
      const normalizedPhone = String(phone || '').replace(/\D/g, '');
      if (!label?.trim() || !/^\d{8,15}$/.test(normalizedPhone)) {
        return res.status(400).json({ error: 'Provide a label and an international phone number with 8–15 digits.' });
      }
      const settings = await FooterContent.findOneAndUpdate(
        { key: 'main' },
        { $set: { whatsappLabel: label.trim(), whatsappHref: `https://wa.me/${normalizedPhone}` }, $setOnInsert: { key: 'main' } },
        { new: true, upsert: true, runValidators: true }
      ).select('whatsappLabel whatsappHref').lean();
      res.set('Cache-Control', 'no-store');
      res.json({ label: settings.whatsappLabel, href: settings.whatsappHref });
    } catch (error) {
      const unauthorized = error.message?.startsWith('UNAUTHORIZED:');
      res.status(unauthorized ? 401 : 500).json({ error: unauthorized ? 'Admin login required.' : 'Could not update WhatsApp settings.' });
    }
  });

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({
        req,
        admin: getAdminFromToken(req),
      }),
    })
  );

  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}/graphql`);
  });
};

startServer();
