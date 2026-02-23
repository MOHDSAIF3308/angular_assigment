import { Router } from 'express';
import { getRecords } from '../controllers/recordController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getRecords);

export default router;
