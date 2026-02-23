import mongoose, { Document, Schema } from 'mongoose';

export interface IRecord extends Document {
  userId: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: Date;
  accessLevel: 'public' | 'restricted';
}

const RecordSchema = new Schema<IRecord>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  priority: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  accessLevel: { type: String, enum: ['public', 'restricted'], default: 'public' }
});

export default mongoose.model<IRecord>('Record', RecordSchema);
