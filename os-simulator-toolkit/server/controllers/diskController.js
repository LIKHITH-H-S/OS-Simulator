import { diskFcfs } from '../../shared/disk/fcfs.js';
import { diskSstf } from '../../shared/disk/sstf.js';
import { diskScan } from '../../shared/disk/scan.js';

export function simulateDiskScheduling(req, res) {
  try {
    const { requestQueue, initialHead, algorithm, direction } = req.body;

    if (!Array.isArray(requestQueue) || requestQueue.length === 0) {
      return res.status(400).json({ error: 'Request queue must be a non-empty array.' });
    }

    const head = Number(initialHead);
    if (!Number.isFinite(head)) {
      return res.status(400).json({ error: 'Initial head position must be a number.' });
    }

    const requests = requestQueue.map(v => Number(v));

    let result;
    switch ((algorithm || 'FCFS').toUpperCase()) {
      case 'FCFS':
        result = diskFcfs(requests, head);
        break;
      case 'SSTF':
        result = diskSstf(requests, head);
        break;
      case 'SCAN':
        result = diskScan(requests, head, direction || 'right');
        break;
      default:
        return res.status(400).json({ error: `Unsupported algorithm: ${algorithm}` });
    }

    return res.json({
      algorithm: algorithm || 'FCFS',
      requestQueue: requests,
      initialHead: head,
      direction: direction || 'right',
      ...result
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Disk scheduling simulation failed.' });
  }
}

