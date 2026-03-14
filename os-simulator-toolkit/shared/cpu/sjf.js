// Shortest Job First (non-preemptive) CPU scheduling.
// Among all processes that have arrived, always run the one with the smallest burst time to completion.
export function sjfScheduling(processes) {
  const remaining = [...processes].map(p => ({ ...p }));
  const timeline = [];
  const detailed = [];

  let currentTime = 0;

  while (remaining.length > 0) {
    const ready = remaining.filter(p => p.arrivalTime <= currentTime);

    if (ready.length === 0) {
      // No process has arrived yet – jump to the next arrival.
      const nextArrival = Math.min(...remaining.map(p => p.arrivalTime));
      currentTime = nextArrival;
      continue;
    }

    // Pick the shortest job among ready processes.
    ready.sort((a, b) => a.burstTime - b.burstTime);
    const current = ready[0];

    const startTime = currentTime;
    const finishTime = startTime + current.burstTime;
    const waitingTime = startTime - current.arrivalTime;
    const turnaroundTime = finishTime - current.arrivalTime;

    timeline.push({
      processId: current.id,
      start: startTime,
      end: finishTime
    });

    detailed.push({
      ...current,
      startTime,
      finishTime,
      waitingTime,
      turnaroundTime
    });

    currentTime = finishTime;
    const idx = remaining.findIndex(p => p.id === current.id && p.arrivalTime === current.arrivalTime);
    if (idx !== -1) remaining.splice(idx, 1);
  }

  const totalWaiting = detailed.reduce((sum, p) => sum + p.waitingTime, 0);
  const totalTurnaround = detailed.reduce((sum, p) => sum + p.turnaroundTime, 0);

  return {
    timeline,
    detailed,
    averageWaitingTime: detailed.length ? totalWaiting / detailed.length : 0,
    averageTurnaroundTime: detailed.length ? totalTurnaround / detailed.length : 0
  };
}

