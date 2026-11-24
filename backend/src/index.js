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

const startServer = async () => {
  await connectDB();
  await seedAdmin();         // create default admin if DB is empty

  const app = express();

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use(cors({
    origin: [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:5174',
    ],
    credentials: true,
  }));
  app.use(bodyParser.json());

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({
        req,
        admin: getAdminFromToken(req),   // null if not logged in
      }),
    })
  );

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}/graphql`);
  });
};

startServer();
