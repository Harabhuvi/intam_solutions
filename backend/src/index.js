require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const { ApolloServer }     = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');

const connectDB   = require('./config/db');
const seedAdmin   = require('./config/seedAdmin');
const seedProducts = require('./config/seedProducts');
const typeDefs    = require('./schema/typeDefs');
const resolvers   = require('./resolvers/resolvers');
const { getAdminFromToken } = require('./config/auth');

const startServer = async () => {
  await connectDB();
  await seedAdmin();
  await seedProducts();

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

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({
        req,
        admin: getAdminFromToken(req),
      }),
    })
  );

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}/graphql`);
  });
};

startServer();
