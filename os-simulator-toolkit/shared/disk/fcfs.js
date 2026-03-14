// FCFS (First-Come, First-Served) disk scheduling.
// Services I/O requests in the order they arrive.
export function diskFcfs(requests, initialHead) {
  const path = [initialHead, ...requests];
  let seekTime = 0;
  for (let i = 0; i < path.length - 1; i += 1) {
    seekTime += Math.abs(path[i + 1] - path[i]);
  }
  return {
    path,
    totalSeekTime: seekTime
  };
}

