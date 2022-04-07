let tickerId = 0;

export function create_ticker(callback: () => void, name: string = `timer_${tickerId++}`) {
  let is_running = false;

  function loop() {
    callback();
    if (is_running) {
      window.requestAnimationFrame(loop);
    }
  }

  return {
    $stop() {
      is_running = false;
    },
    $start() {
      is_running = true;
      window.requestAnimationFrame(loop);
    },
    get $is_running() {
      return is_running;
    },
    get $name() {
      return name;
    },
  };
}

export function createDebounce<T extends any = any>(fn: (value: T) => void) {
  let timer: number | undefined;
  return function (value: T) {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(value), 300);
  };
}
