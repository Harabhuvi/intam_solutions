const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');

const env = require('./config/env');
const corsOptions = require('./config/cors');
const { getAdminFromToken } = require('./services/auth.service');
const { graphqlLimiter } = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const apiRoutes = require('./routes');

const safeAdminFromRequest = (req) => {
  try {
    return getAdminFromToken(req) || null;
  } catch (_error) {
    return null;
  }
};

const createApp = async () => {
  const app = express();

  app.set('trust proxy', 1);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: !env.isProd,
  });
  await apolloServer.start();

  app.use(cors(corsOptions));
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api', apiRoutes);

  app.use(
    '/graphql',
    graphqlLimiter,
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ req, admin: safeAdminFromRequest(req) }),
    })
  );

  app.use(notFound);
  app.use(errorHandler);

  return { app, apolloServer };
};

module.exports = { createApp };