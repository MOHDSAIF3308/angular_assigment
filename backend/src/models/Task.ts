import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  taskId: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>({
  taskId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: String, required: true },
  assignedBy: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
    default: 'Not Started'
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  dueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<ITask>('Task', TaskSchema);
