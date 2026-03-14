import { Router } from 'express';
import { simulateBankers } from '../controllers/deadlockController.js';

const router = Router();

router.post('/simulate', simulateBankers);

export default router;

