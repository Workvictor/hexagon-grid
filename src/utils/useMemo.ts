export const useMemo = <T>(fn: (...args: T[]) => void, prev: T[]) => {
  return (...args: T[]) => {
    let isChanged = false;		
    args.forEach((val, ind) => {
      isChanged = val !== prev[ind];
      val = prev[ind];
    });
    if (isChanged) {
      fn(...args);
      isChanged = false;
    }
  };
};
