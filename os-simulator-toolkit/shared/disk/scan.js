// SCAN (Elevator) disk scheduling.
// The head moves in one direction servicing requests, then reverses.
export function diskScan(requests, initialHead, direction = 'right') {
  const sorted = [...requests].sort((a, b) => a - b);
  const maxRequest = sorted.length ? sorted[sorted.length - 1] : initialHead;
  const minRequest = sorted.length ? sorted[0] : initialHead;

  const right = sorted.filter(r => r >= initialHead);
  const left = sorted.filter(r => r < initialHead).reverse();

  let path = [initialHead];

  if (direction === 'right') {
    if (right.length) {
      path = path.concat(right);
      if (left.length) {
        path.push(maxRequest);
        path = path.concat(left);
      }
    } else if (left.length) {
      path = path.concat(left);
    }
  } else {
    if (left.length) {
      path = path.concat(left);
      if (right.length) {
        path.push(minRequest);
        path = path.concat(right);
      }
    } else if (right.length) {
      path = path.concat(right);
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

