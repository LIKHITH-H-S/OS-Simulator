// LRU (Least Recently Used) page replacement.
// When a fault occurs and frames are full, evict the page that was used farthest in the past.
export function lruPageReplacement(referenceString, frameCount) {
  const frames = [];
  const lastUsedIndex = new Map();
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
        // Pick frame whose page has smallest last-used index.
        let lruPage = frames[0];
        let lruIndex = lastUsedIndex.get(lruPage) ?? -1;
        frames.forEach(p => {
          const idx = lastUsedIndex.get(p) ?? -1;
          if (idx < lruIndex) {
            lruPage = p;
            lruIndex = idx;
          }
        });
        victim = lruPage;
        const replaceIdx = frames.indexOf(lruPage);
        frames[replaceIdx] = page;
      }
    }

    lastUsedIndex.set(page, index);

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

