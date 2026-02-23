import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/auth';
import { delay } from '../utils/delay';

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const delayMs = req.query.delay as string;
    if (delayMs) {
      await delay(parseInt(delayMs));
    }

    const { role, userId } = req.user;
    let tasks;

    if (role === 'Admin') {
      tasks = await Task.find().sort({ createdAt: -1 });
    } else {
      tasks = await Task.find({ assignedTo: userId }).sort({ createdAt: -1 });
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role } = req.user;

    // Only admins can create tasks
    if (role !== 'Admin') {
      res.status(403).json({ message: 'Only admins can create tasks' });
      return;
    }

    const { taskId, title, description, assignedTo, priority, dueDate } = req.body;

    if (!taskId || !title || !description || !assignedTo || !dueDate) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const existingTask = await Task.findOne({ taskId });
    if (existingTask) {
      res.status(400).json({ message: 'Task ID already exists' });
      return;
    }

    const task = new Task({
      taskId,
      title,
      description,
      assignedTo,
      assignedBy: req.user.userId,
      priority: priority || 'Medium',
      status: 'Not Started',
      dueDate: new Date(dueDate),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const { role, userId } = req.user;

    if (!status) {
      res.status(400).json({ message: 'Status is required' });
      return;
    }

    const task = await Task.findOne({ taskId });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Users can only update their own assigned tasks, admins can update any task
    if (role !== 'Admin' && task.assignedTo !== userId) {
      res.status(403).json({ message: 'Not authorized to update this task' });
      return;
    }

    task.status = status;
    task.updatedAt = new Date();
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { title, description, priority, dueDate, assignedTo } = req.body;
    const { role } = req.user;

    // Only admins can update tasks
    if (role !== 'Admin') {
      res.status(403).json({ message: 'Only admins can update tasks' });
      return;
    }

    const task = await Task.findOne({ taskId });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = new Date(dueDate);
    if (assignedTo) task.assignedTo = assignedTo;
    
    task.updatedAt = new Date();
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { role } = req.user;

    // Only admins can delete tasks
    if (role !== 'Admin') {
      res.status(403).json({ message: 'Only admins can delete tasks' });
      return;
    }

    const task = await Task.findOneAndDelete({ taskId });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
