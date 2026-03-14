// SSTF (Shortest Seek Time First) disk scheduling.
// Always services the request closest to the current head position.
export function diskSstf(requests, initialHead) {
  const remaining = [...requests];
  const path = [initialHead];
  let current = initialHead;
  let seekTime = 0;

  while (remaining.length > 0) {
    let bestIdx = 0;
    let bestDist = Math.abs(remaining[0] - current);
    for (let i = 1; i < remaining.length; i += 1) {
      const dist = Math.abs(remaining[i] - current);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    const next = remaining.splice(bestIdx, 1)[0];
    seekTime += Math.abs(next - current);
    current = next;
    path.push(current);
  }

  return {
    path,
    totalSeekTime: seekTime
  };
}

