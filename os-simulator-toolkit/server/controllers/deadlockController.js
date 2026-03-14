import { bankersAlgorithm } from '../../shared/deadlock/bankers.js';

export function simulateBankers(req, res) {
  try {
    const { allocation, maximum, available } = req.body;

    if (!Array.isArray(allocation) || !Array.isArray(maximum) || !Array.isArray(available)) {
      return res.status(400).json({ error: 'Allocation, maximum and available must be arrays.' });
    }

    const n = allocation.length;
    if (n === 0 || maximum.length !== n) {
      return res.status(400).json({ error: 'Allocation and maximum matrices must have same non-zero length.' });
    }

    const m = available.length;
    if (!allocation.every(row => row.length === m) || !maximum.every(row => row.length === m)) {
      return res.status(400).json({ error: 'All rows in allocation and maximum must have the same number of resource types as available.' });
    }

    const allocNum = allocation.map(row => row.map(Number));
    const maxNum = maximum.map(row => row.map(Number));
    const availNum = available.map(Number);

    const result = bankersAlgorithm(allocNum, maxNum, availNum);

    return res.json({
      allocation: allocNum,
      maximum: maxNum,
      available: availNum,
      ...result
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Banker’s algorithm simulation failed.' });
  }
}

