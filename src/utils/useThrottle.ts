export const useThrottle = <T>(delay: number, fn: (...args: T[]) => void) => {
  let isWaiting = false;
  let waitingArgs: null | T[] = null;

  const cbFN = () => {
    if (!waitingArgs) {
      isWaiting = false;
    } else {
      fn(...waitingArgs);
      waitingArgs = null;
      setTimeout(cbFN, delay);
    }
  };

  return (...args: T[]) => {
    if (isWaiting) {
      waitingArgs = args;
      return;
    }

    fn(...args);
    isWaiting = true;
    setTimeout(cbFN, delay);
  };
};
