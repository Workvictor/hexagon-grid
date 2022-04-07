export type Subscriber<T> = (value: T) => void;

export class Observer<T> {
  subscribers: Subscriber<T>[] = [];
  unsub_queue: Subscriber<T>[] = [];
  constructor(public value: T) {}

  Subscribe(subscriber: Subscriber<T>) {
    this.subscribers.push(subscriber);
    return {
      unsubscribe: () => {
        this.unsub_queue.push(subscriber);
      },
    };
  }

  Broadcast() {
    this.subscribers.forEach(sub => sub(this.value));
    if (this.unsub_queue.length > 0) {
      this.unsub_queue.forEach(subscriber => {
        const index = this.subscribers.indexOf(subscriber);
        if (index >= 0) {
          this.subscribers.splice(index, 1);
        }
      });
      this.unsub_queue.length = 0;
    }
  }

  Set(setter: ((prev: T) => T) | T) {
    if (setter instanceof Function) {
      this.value = setter(this.value);
      this.Broadcast();
      return;
    }
    this.value = setter;
    this.Broadcast();
  }

  Get() {
    return this.value;
  }

  Once(subscriber: Subscriber<T>) {
    const call = this.Subscribe(v => {
      subscriber(v);
      call.unsubscribe();
    });
  }

  IsEqual(value: T) {
    return value === this.value;
  }
}

export function createObserver<T>(observedValue: T) {
  const subscribers: Subscriber<T>[] = [];
  const unsub_queue: Subscriber<T>[] = [];

  function Subscribe(subscriber: Subscriber<T>) {
    subscribers.push(subscriber);
    return {
      unsubscribe() {
        unsub_queue.push(subscriber);
      },
    };
  }

  function Broadcast() {
    subscribers.forEach(sub => sub(observedValue));
    if (unsub_queue.length > 0) {
      unsub_queue.forEach(subscriber => {
        const index = subscribers.indexOf(subscriber);
        if (index >= 0) {
          subscribers.splice(index, 1);
        }
      });
      unsub_queue.length = 0;
    }
  }

  function ClearSubscriptions() {
    subscribers.length = 0;
    unsub_queue.length = 0;
  }

  function Once(subscriber: Subscriber<T>) {
    const call = Subscribe(v => {
      subscriber(v);
      call.unsubscribe();
    });
  }

  function Set(setter: ((prev: T) => T) | T) {
    if (setter instanceof Function) {
      observedValue = setter(observedValue);
      Broadcast();
      return;
    }
    observedValue = setter;
    Broadcast();
  }

  function Get() {
    return observedValue;
  }

  function IsEqual(value: T) {
    return value === observedValue;
  }

  return {
    Get: Get,
    Set: Set,
    Broadcast: Broadcast,
    Subscribe: Subscribe,
    Once: Once,
    IsEqual: IsEqual,
    ClearSubscriptions: ClearSubscriptions,

    get v() {
      return observedValue;
    },
  };
}
