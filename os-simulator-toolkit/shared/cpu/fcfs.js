// First-Come, First-Served (FCFS) CPU scheduling.
// Processes are run in the order of arrival; once started, each process runs to completion.
export function fcfsScheduling(processes) {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let currentTime = 0;
  const timeline = [];
  const detailed = [];

  for (const p of sorted) {
    const startTime = Math.max(currentTime, p.arrivalTime);
    const finishTime = startTime + p.burstTime;
    const waitingTime = startTime - p.arrivalTime;
    const turnaroundTime = finishTime - p.arrivalTime;

    timeline.push({
      processId: p.id,
      start: startTime,
      end: finishTime
    });

    detailed.push({
      ...p,
      startTime,
      finishTime,
      waitingTime,
      turnaroundTime
    });

    currentTime = finishTime;
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

