import { fcfsScheduling } from '../../shared/cpu/fcfs.js';
import { sjfScheduling } from '../../shared/cpu/sjf.js';
import { roundRobinScheduling } from '../../shared/cpu/roundRobin.js';
import { srtfScheduling } from '../../shared/cpu/srtf.js';
import { priorityScheduling } from '../../shared/cpu/priority.js';

export function simulateCpuScheduling(req, res) {
  try {
    const { processes, algorithm, timeQuantum } = req.body;

    if (!Array.isArray(processes) || processes.length === 0) {
      return res.status(400).json({ error: 'At least one process is required.' });
    }

    const normalized = processes.map((p, idx) => ({
      id: p.id ?? `P${idx + 1}`,
      arrivalTime: Number(p.arrivalTime),
      burstTime: Number(p.burstTime),
      priority: Number.isFinite(p.priority) ? Number(p.priority) : 0
    }));

    let result;
    switch ((algorithm || 'FCFS').toUpperCase()) {
      case 'FCFS':
        result = fcfsScheduling(normalized);
        break;
      case 'SJF':
        result = sjfScheduling(normalized);
        break;
      case 'SRTF':
      case 'SHORT_REMAINING_TIME_FIRST':
        result = srtfScheduling(normalized);
        break;
      case 'RR':
      case 'ROUND_ROBIN':
        result = roundRobinScheduling(normalized, Number(timeQuantum));
        break;
      case 'PRIORITY_NON_PREEMPTIVE':
      case 'PRIORITY_NONPREEMPTIVE':
      case 'PRIORITY (NON-PREEMPTIVE)':
        result = priorityScheduling(normalized, { preemptive: false });
        break;
      case 'PRIORITY_PREEMPTIVE':
      case 'PRIORITY (PREEMPTIVE)':
        result = priorityScheduling(normalized, { preemptive: true });
        break;
      default:
        return res.status(400).json({ error: `Unsupported algorithm: ${algorithm}` });
    }

    return res.json({
      algorithm: algorithm || 'FCFS',
      processes: normalized,
      ...result
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'CPU scheduling simulation failed.' });
  }
}

