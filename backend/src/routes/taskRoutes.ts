import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTaskStatus,
  updateTask,
  deleteTask
} from '../controllers/taskController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getTasks);
router.post('/', authenticate, createTask);
router.patch('/:taskId/status', authenticate, updateTaskStatus);
router.patch('/:taskId', authenticate, updateTask);
router.delete('/:taskId', authenticate, deleteTask);

export default router;
