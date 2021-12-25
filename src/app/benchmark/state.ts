export class State<T> {
  observers = [];
  constructor(public current: T) {}

  subscribe(observer: { next(value: T): void }) {
    const { observers } = this;
    observers.push(observer);
    observer.next(this.current);
    return {
      unsubscribe() {
        const idx = observers.indexOf(observer);
        if (idx >= 0) observers.splice(idx, 1);
      },
    };
  }

  update(func: (p: T) => T) {
    const { current } = this;
    const newValue = func(current);
    if (newValue !== current) {
      this.current = newValue;
      for (const o of this.observers) {
        o.next(newValue);
      }
    }
  }

  toString() {
    return this.current;
  }
}
