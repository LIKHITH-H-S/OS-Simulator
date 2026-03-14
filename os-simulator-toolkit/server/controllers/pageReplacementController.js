import { fifoPageReplacement } from '../../shared/page/fifo.js';
import { lruPageReplacement } from '../../shared/page/lru.js';
import { optimalPageReplacement } from '../../shared/page/optimal.js';

export function simulatePageReplacement(req, res) {
  try {
    const { referenceString, frameCount, algorithm } = req.body;

    if (!Array.isArray(referenceString) || referenceString.length === 0) {
      return res.status(400).json({ error: 'Reference string must be a non-empty array.' });
    }

    const frames = Number(frameCount);
    if (!Number.isFinite(frames) || frames <= 0) {
      return res.status(400).json({ error: 'Number of frames must be a positive integer.' });
    }

    const refs = referenceString.map(v => Number(v));

    let result;
    switch ((algorithm || 'FIFO').toUpperCase()) {
      case 'FIFO':
        result = fifoPageReplacement(refs, frames);
        break;
      case 'LRU':
        result = lruPageReplacement(refs, frames);
        break;
      case 'OPT':
      case 'OPTIMAL':
        result = optimalPageReplacement(refs, frames);
        break;
      default:
        return res.status(400).json({ error: `Unsupported algorithm: ${algorithm}` });
    }

    return res.json({
      algorithm: algorithm || 'FIFO',
      referenceString: refs,
      frameCount: frames,
      ...result
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Page replacement simulation failed.' });
  }
}

