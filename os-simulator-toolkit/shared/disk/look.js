// LOOK disk scheduling.
// The head moves in one direction servicing requests, then reverses when there are no further requests in that direction.
export function diskLook(requests, initialHead, direction = 'right') {
  const sorted = [...requests].sort((a, b) => a - b);
  const right = sorted.filter(r => r >= initialHead);
  const left = sorted.filter(r => r < initialHead).reverse();

  const path = [initialHead];

  if (direction === 'right') {
    path.push(...right);
    if (left.length) {
      path.push(...left);
    }
  } else {
    path.push(...left);
    if (right.length) {
      path.push(...right);
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
