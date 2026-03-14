// FIFO page replacement.
// The oldest loaded page is evicted first when a fault occurs and all frames are full.
export function fifoPageReplacement(referenceString, frameCount) {
  const frames = [];
  const steps = [];
  let pointer = 0;
  let faults = 0;
  let hits = 0;

  referenceString.forEach((page, index) => {
    const alreadyInFrame = frames.includes(page);
    let victim = null;

    if (alreadyInFrame) {
      hits += 1;
    } else {
      faults += 1;
      if (frames.length < frameCount) {
        frames.push(page);
      } else if (frameCount > 0) {
        victim = frames[pointer];
        frames[pointer] = page;
        pointer = (pointer + 1) % frameCount;
      }
    }

    steps.push({
      index,
      reference: page,
      frames: [...frames],
      hit: alreadyInFrame,
      fault: !alreadyInFrame,
      victim
    });
  });

  return {
    steps,
    totalFaults: faults,
    totalHits: hits
  };
}

