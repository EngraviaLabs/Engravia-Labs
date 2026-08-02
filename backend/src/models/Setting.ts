import mongoose, { Schema, Document } from 'mongoose';
export interface ISetting extends Document {
  key: string; value: any;
  group: 'general'|'seo'|'payment'|'shipping'|'email'|'social'|'homepage'|'policies'|'faqs';
  label: string; type: 'string'|'number'|'boolean'|'json'|'array';
  updatedAt: Date;
}
const settingSchema = new Schema<ISetting>({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
  group: { type: String, enum: ['general','seo','payment','shipping','email','social','homepage','policies','faqs'], default: 'general' },
  label: { type: String, required: true },
  type: { type: String, enum: ['string','number','boolean','json','array'], default: 'string' },
}, { timestamps: true });
settingSchema.index({ group: 1 });
export default mongoose.model<ISetting>('Setting', settingSchema);
