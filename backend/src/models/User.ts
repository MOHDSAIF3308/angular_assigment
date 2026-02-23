import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  password: string;
  role: 'General User' | 'Admin';
  name: string;
  email: string;
  department: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['General User', 'Admin'], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
