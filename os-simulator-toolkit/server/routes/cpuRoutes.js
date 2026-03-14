import { Router } from 'express';
import { simulateCpuScheduling } from '../controllers/cpuController.js';

const router = Router();

router.post('/simulate', simulateCpuScheduling);

export default router;

