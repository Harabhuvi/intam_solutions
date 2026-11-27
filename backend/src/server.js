const mongoose = require('mongoose');
const env = require('./config/env');
const connectDB = require('./config/db');
const seedAdmin = require('./seeds/seedAdmin');
const { createApp } = require('./app');

const SHUTDOWN_TIMEOUT_MS = 10_000;

const startServer = async () => {
  await connectDB();
  await seedAdmin();

  const { app, apolloServer } = await createApp();
  const httpServer = app.listen(env.port, () => {
    console.log(`🚀 Server: http://localhost:${env.port}/graphql`);
  });

  let shuttingDown = false;
  const shutdown = async (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`${signal} received, shutting down...`);

    setTimeout(() => process.exit(1), SHUTDOWN_TIMEOUT_MS).unref();

    try {
      await new Promise((resolve) => httpServer.close(resolve));
      await apolloServer.stop();
      await mongoose.connection.close();
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});