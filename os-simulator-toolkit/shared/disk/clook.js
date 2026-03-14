// C-LOOK (Circular LOOK) disk scheduling.
// The head moves in one direction servicing requests, then jumps to the farthest request in the opposite direction and continues.
export function diskClook(requests, initialHead, direction = 'right') {
  const sorted = [...requests].sort((a, b) => a - b);
  const right = sorted.filter(r => r >= initialHead);
  const left = sorted.filter(r => r < initialHead);

  const path = [initialHead];

  if (direction === 'right') {
    if (right.length) {
      path.push(...right);
    }
    if (left.length) {
      // jump to the smallest left request without traversing back
      path.push(left[0]);
      path.push(...left);
    }
  } else {
    if (left.length) {
      path.push(...left.reverse());
    }
    if (right.length) {
      path.push(right[right.length - 1]);
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
