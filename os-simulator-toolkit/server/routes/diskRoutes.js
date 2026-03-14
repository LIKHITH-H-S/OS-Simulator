import { Router } from 'express';
import { simulateDiskScheduling } from '../controllers/diskController.js';

const router = Router();

router.post('/simulate', simulateDiskScheduling);

export default router;

