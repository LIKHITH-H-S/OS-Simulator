// Optimal page replacement.
// When a fault occurs and frames are full, evict the page that will not be used for the longest time in the future.
export function optimalPageReplacement(referenceString, frameCount) {
  const frames = [];
  const steps = [];
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
        // For each page in frames, find its next use; evict the one used farthest in future (or never used).
        let victimPage = frames[0];
        let farthest = -1;

        frames.forEach(p => {
          const nextUse = referenceString.slice(index + 1).indexOf(p);
          if (nextUse === -1) {
            // Not used again – best candidate.
            victimPage = p;
            farthest = Number.POSITIVE_INFINITY;
          } else if (nextUse > farthest) {
            farthest = nextUse;
            victimPage = p;
          }
        });

        victim = victimPage;
        const replaceIdx = frames.indexOf(victimPage);
        frames[replaceIdx] = page;
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

