// Priority scheduling (both preemptive and non-preemptive).
// Priorities are numeric: lower values mean higher priority.
// If priorities are equal, tiebreak by arrival time then process ID.

const comparePriority = (a, b) => {
  if (a.priority !== b.priority) return a.priority - b.priority;
  if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
  return a.id.localeCompare(b.id);
};

export function priorityScheduling(processes, { preemptive = false } = {}) {
  const procs = processes.map(p => ({
    ...p,
    priority: Number.isFinite(p.priority) ? Number(p.priority) : 0,
    remainingTime: p.burstTime,
    startTime: null,
    finishTime: null
  }));

  const timeline = [];
  let currentTime = 0;

  const getReady = () =>
    procs.filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0);

  const getNextArrivalTime = () => {
    const future = procs.filter(p => p.arrivalTime > currentTime && p.remainingTime > 0);
    if (future.length === 0) return null;
    return Math.min(...future.map(p => p.arrivalTime));
  };

  const appendSegment = (processId, start, end) => {
    if (timeline.length > 0) {
      const last = timeline[timeline.length - 1];
      if (last.processId === processId && last.end === start) {
        last.end = end;
        return;
      }
    }
    timeline.push({ processId, start, end });
  };

  while (procs.some(p => p.remainingTime > 0)) {
    const ready = getReady();

    if (ready.length === 0) {
      const nextArrival = getNextArrivalTime();
      if (nextArrival === null) break;
      currentTime = nextArrival;
      continue;
    }

    ready.sort(comparePriority);
    const current = ready[0];

    if (current.startTime === null) {
      current.startTime = currentTime;
    }

    let runTime;
    if (preemptive) {
      const nextArrival = getNextArrivalTime();
      const timeUntilNextArrival = nextArrival !== null ? nextArrival - currentTime : Infinity;
      runTime = Math.min(current.remainingTime, timeUntilNextArrival);
    } else {
      runTime = current.remainingTime;
    }

    appendSegment(current.id, currentTime, currentTime + runTime);

    currentTime += runTime;
    current.remainingTime -= runTime;

    if (current.remainingTime === 0) {
      current.finishTime = currentTime;
    }
  }

  const detailed = procs.map(p => {
    const finishTime = p.finishTime ?? currentTime;
    const turnaroundTime = finishTime - p.arrivalTime;
    const waitingTime = turnaroundTime - p.burstTime;
    return {
      id: p.id,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      priority: p.priority,
      startTime: p.startTime,
      finishTime,
      waitingTime,
      turnaroundTime
    };
  });

  const totalWaiting = detailed.reduce((sum, p) => sum + p.waitingTime, 0);
  const totalTurnaround = detailed.reduce((sum, p) => sum + p.turnaroundTime, 0);

  return {
    timeline,
    detailed,
    averageWaitingTime: detailed.length ? totalWaiting / detailed.length : 0,
    averageTurnaroundTime: detailed.length ? totalTurnaround / detailed.length : 0
  };
}
