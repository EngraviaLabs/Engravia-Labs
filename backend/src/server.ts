import 'dotenv/config';
import app from './app';
import connectDB from './config/database';

const PORT = parseInt(process.env.PORT || '5000', 10);

const start = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection attempt warning:', err);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ENGRAVIA LABS API running on port ${PORT} [${process.env.NODE_ENV || 'production'}]`);
  });

  const shutdown = (sig: string) => {
    console.log(`${sig} – shutting down gracefully`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

start();
