import { Response } from 'express';
import Record from '../models/Record';
import { AuthRequest } from '../middleware/auth';
import { delay } from '../utils/delay';

export const getRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const delayMs = req.query.delay as string;
    if (delayMs) {
      await delay(parseInt(delayMs));
    }

    const { role, userId } = req.user;
    let records;

    if (role === 'Admin') {
      records = await Record.find();
    } else {
      records = await Record.find({
        $or: [
          { userId },
          { accessLevel: 'public' }
        ]
      });
    }

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
