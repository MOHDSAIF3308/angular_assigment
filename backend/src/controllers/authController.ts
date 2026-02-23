import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { delay } from '../utils/delay';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, password, delayMs } = req.body;

    if (delayMs) {
      await delay(parseInt(delayMs));
    }

    const user = await User.findOne({ userId });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user.userId, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
