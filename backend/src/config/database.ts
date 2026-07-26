import mongoose from 'mongoose';
const connectDB = async (): Promise<void> => {
  const conn = await mongoose.connect(process.env.MONGODB_URI as string, { maxPoolSize: 10 });
  console.log(`MongoDB Connected: ${conn.connection.host}`);
  mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));
  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
};
export default connectDB;
