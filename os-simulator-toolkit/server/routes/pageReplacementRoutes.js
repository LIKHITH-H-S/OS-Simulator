import { Router } from 'express';
import { simulatePageReplacement } from '../controllers/pageReplacementController.js';

const router = Router();

router.post('/simulate', simulatePageReplacement);

export default router;

