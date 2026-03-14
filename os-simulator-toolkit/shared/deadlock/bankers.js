// Banker's Algorithm for deadlock avoidance.
// Determines whether the system is in a safe state and, if so, returns a safe sequence.
export function bankersAlgorithm(allocation, maximum, available) {
  const n = allocation.length; // number of processes
  const m = available.length; // number of resource types

  // Compute Need matrix = Max - Allocation
  const need = Array.from({ length: n }, (_, i) =>
    Array.from({ length: m }, (__ , j) => maximum[i][j] - allocation[i][j])
  );

  const work = [...available];
  const finish = Array(n).fill(false);
  const safeSequence = [];

  let progress;
  do {
    progress = false;
    for (let i = 0; i < n; i += 1) {
      if (!finish[i]) {
        // Check if need[i] <= work for all resources
        const canAllocate = need[i].every((needVal, j) => needVal <= work[j]);
        if (canAllocate) {
          for (let j = 0; j < m; j += 1) {
            work[j] += allocation[i][j];
          }
          finish[i] = true;
          safeSequence.push(i);
          progress = true;
        }
      }
    }
  } while (progress);

  const isSafe = finish.every(Boolean);

  return {
    isSafe,
    safeSequence: isSafe ? safeSequence : [],
    need,
    workSequence: work
  };
}

