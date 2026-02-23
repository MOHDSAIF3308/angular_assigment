import { Router } from 'express';
import { getAllUsers, createUser, updateUser, deleteUser } from '../controllers/userController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, isAdmin, getAllUsers);
router.post('/', authenticate, isAdmin, createUser);
router.put('/:id', authenticate, isAdmin, updateUser);
router.delete('/:id', authenticate, isAdmin, deleteUser);

export default router;
