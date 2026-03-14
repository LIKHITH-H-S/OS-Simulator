// C-SCAN (Circular SCAN) disk scheduling.
// The head moves in one direction servicing requests, then jumps to the opposite end and continues.
export function diskCscan(requests, initialHead, direction = 'right') {
  const sorted = [...requests].sort((a, b) => a - b);
  const maxRequest = sorted.length ? sorted[sorted.length - 1] : initialHead;
  const minRequest = sorted.length ? sorted[0] : initialHead;

  const right = sorted.filter(r => r >= initialHead);
  const left = sorted.filter(r => r < initialHead);

  const path = [initialHead];

  if (direction === 'right') {
    if (right.length) {
      path.push(...right);
    }
    if (left.length) {
      // jump to the minimum request without counting seek time for wrap
      path.push(minRequest);
      path.push(...left);
    }
  } else {
    if (left.length) {
      path.push(...left.reverse());
    }
    if (right.length) {
      path.push(maxRequest);
      path.push(...right.reverse());
    }
  }

  let seekTime = 0;
  for (let i = 0; i < path.length - 1; i += 1) {
    seekTime += Math.abs(path[i + 1] - path[i]);
  }

  return {
    path,
    totalSeekTime: seekTime
  };
}
