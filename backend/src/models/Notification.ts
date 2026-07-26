import mongoose, { Schema, Document } from 'mongoose';
export interface INotification extends Document {
  user: mongoose.Types.ObjectId; type: string; title: string; message: string;
  data?: any; isRead: boolean; createdAt: Date;
}
const notificationSchema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: Schema.Types.Mixed,
  isRead: { type: Boolean, default: false },
}, { timestamps: true });
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
export default mongoose.model<INotification>('Notification', notificationSchema);
