import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('⚠️ WARNING: MONGODB_URI environment variable is not set!');
    console.error('📝 Please set MONGODB_URI in your Render environment variables.');
    return;
  }
  try {
    const conn = await mongoose.connect(uri, { maxPoolSize: 10 });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));
    mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
  } catch (err: any) {
    console.error('❌ MongoDB Connection Error:', err.message || err);
  }
};

export default connectDB;
