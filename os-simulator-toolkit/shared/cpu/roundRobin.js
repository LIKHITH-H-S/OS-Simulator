// Round Robin CPU scheduling.
// Each process is given a fixed time quantum in a cyclic order until completion.
export function roundRobinScheduling(processes, timeQuantum) {
  if (!timeQuantum || timeQuantum <= 0) {
    throw new Error('Time quantum must be a positive number.');
  }

  const procs = processes.map(p => ({
    ...p,
    remainingTime: p.burstTime,
    finishTime: null
  }));

  const timeline = [];
  let currentTime = 0;

  // Queue stores indices into procs array.
  const readyQueue = [];
  const byArrival = [...procs].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let arrivalIdx = 0;

  const enqueueArrived = () => {
    while (arrivalIdx < byArrival.length && byArrival[arrivalIdx].arrivalTime <= currentTime) {
      const procIndex = procs.findIndex(p => p.id === byArrival[arrivalIdx].id && p.arrivalTime === byArrival[arrivalIdx].arrivalTime);
      if (procIndex !== -1 && !readyQueue.includes(procIndex) && procs[procIndex].remainingTime > 0) {
        readyQueue.push(procIndex);
      }
      arrivalIdx += 1;
    }
  };

  // Initialize queue at time 0
  enqueueArrived();
  if (readyQueue.length === 0 && byArrival.length > 0) {
    currentTime = byArrival[0].arrivalTime;
    enqueueArrived();
  }

  while (readyQueue.length > 0) {
    const idx = readyQueue.shift();
    const p = procs[idx];

    const start = currentTime;
    const slice = Math.min(timeQuantum, p.remainingTime);
    const end = start + slice;

    timeline.push({
      processId: p.id,
      start,
      end
    });

    currentTime = end;
    p.remainingTime -= slice;

    // Add any newly arrived processes at this time
    enqueueArrived();

    if (p.remainingTime > 0) {
      // Not finished – requeue
      readyQueue.push(idx);
    } else {
      p.finishTime = currentTime;
    }

    // If queue is empty but unfinished processes remain, jump to next arrival
    if (readyQueue.length === 0) {
      const unfinished = procs.filter(q => q.remainingTime > 0);
      if (unfinished.length > 0) {
        const nextArrival = Math.min(...unfinished.map(q => q.arrivalTime));
        if (currentTime < nextArrival) {
          currentTime = nextArrival;
          enqueueArrived();
        }
      }
    }
  }

  const detailed = procs.map(p => {
    const turnaroundTime = p.finishTime - p.arrivalTime;
    const waitingTime = turnaroundTime - p.burstTime;
    return {
      id: p.id,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      startTime: null, // not well-defined for RR; kept for symmetry
      finishTime: p.finishTime,
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

