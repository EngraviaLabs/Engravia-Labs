import mongoose, { Schema, Document } from 'mongoose';
export interface IReview extends Document {
  product: mongoose.Types.ObjectId; user: mongoose.Types.ObjectId; order?: mongoose.Types.ObjectId;
  rating: number; title: string; body: string;
  images?: { url: string; publicId: string }[];
  isVerifiedPurchase: boolean; isApproved: boolean; isPublished: boolean;
  helpfulVotes: mongoose.Types.ObjectId[];
  adminReply?: { text: string; repliedAt: Date };
  createdAt: Date;
}
const reviewSchema = new Schema<IReview>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: Schema.Types.ObjectId, ref: 'Order' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  body: { type: String, required: true, trim: true, maxlength: 2000 },
  images: [{ url: String, publicId: String }],
  isVerifiedPurchase: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  helpfulVotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  adminReply: { text: String, repliedAt: Date },
}, { timestamps: true });
reviewSchema.index({ product: 1, isApproved: 1, isPublished: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.post('save', async function () {
  const stats = await mongoose.model('Review').aggregate([
    { $match: { product: this.product, isApproved: true, isPublished: true } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(this.product, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].count,
    });
  }
});
export default mongoose.model<IReview>('Review', reviewSchema);
