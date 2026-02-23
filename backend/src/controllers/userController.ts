import { Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { delay } from '../utils/delay';

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const delayMs = req.query.delay as string;
    if (delayMs) {
      await delay(parseInt(delayMs));
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, password, role, name, email, department } = req.body;

    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      userId,
      password: hashedPassword,
      role,
      name,
      email,
      department
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully', userId: user.userId });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, department, role, password } = req.body;

    const updateData: any = { name, email, department, role };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
