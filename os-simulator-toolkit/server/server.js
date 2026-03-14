import express from 'express';
import cors from 'cors';

import cpuRoutes from './routes/cpuRoutes.js';
import pageReplacementRoutes from './routes/pageReplacementRoutes.js';
import deadlockRoutes from './routes/deadlockRoutes.js';
import diskRoutes from './routes/diskRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'OS Simulator Toolkit API' });
});

app.use('/api/cpu', cpuRoutes);
app.use('/api/page-replacement', pageReplacementRoutes);
app.use('/api/deadlock', deadlockRoutes);
app.use('/api/disk', diskRoutes);

app.listen(PORT, () => {
  console.log(`OS Simulator Toolkit API running on http://localhost:${PORT}`);
});

