import { simpleState } from '../simpleState';

describe('state', () => {
  it('Initialize and get value', () => {
    const s = simpleState({ foo: 'bar' });
    expect(s.foo).toBe('bar');
  });

  it('Set value', () => {
    const s = simpleState({ foo: 'bar' });
    s.foo = 'baz';
    expect(s.foo).toBe('baz');
  });

  it('Put', () => {
    const s = simpleState({ foo: 1, bar: 'baz' });
    s.put({ foo: 2 });
    expect(s.foo).toBe(2);
    expect(s.bar).toBe('baz');
  });

  it('Subscribe and unsubscribe', () => {
    const subscriber = jest.fn(() => {});
    const s = simpleState({ foo: 1 });
    const unsubscribe = s.subscribe(subscriber, false);
    expect(subscriber).toHaveBeenCalledTimes(1);
    s.foo = 2;
    expect(subscriber).toHaveBeenCalledTimes(2);
    unsubscribe();
    s.foo = 3;
    expect(subscriber).toHaveBeenCalledTimes(2);
  });

  it('Subscribe without filter', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const subscriber = jest.fn(({ foo }, init) => {});
    const s = simpleState({ foo: 1, bar: 'baz' });
    const unsubscribe = s.subscribe(subscriber);
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith({ foo: 1, bar: 'baz' }, true);
    s.foo = 2;
    expect(subscriber).toHaveBeenCalledTimes(2);
    expect(subscriber).toHaveBeenCalledWith({ foo: 2, bar: 'baz' }, false);
    s.bar = 'new bar';
    expect(subscriber).toHaveBeenCalledTimes(2);
    unsubscribe();
  });

  it('Subscribe without selector and disabled filter', () => {
    const subscriber = jest.fn(() => {});
    const s = simpleState({ foo: 1, bar: 'baz' });
    const unsubscribe = s.subscribe(subscriber, false);
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith({ foo: 1, bar: 'baz' }, true);
    s.foo = 2;
    expect(subscriber).toHaveBeenCalledTimes(2);
    expect(subscriber).toHaveBeenCalledWith({ foo: 2, bar: 'baz' }, false);
    s.bar = 'new bar';
    expect(subscriber).toHaveBeenCalledTimes(3);
    expect(subscriber).toHaveBeenCalledWith({ foo: 2, bar: 'new bar' }, false);
    unsubscribe();
  });

  it('Subscribe with selector and disabled filter', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const subscriber = jest.fn(({ foo }, init) => {});
    const s = simpleState({ foo: 1, bar: 'baz' });
    const unsubscribe = s.subscribe(subscriber, false);
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith({ foo: 1, bar: 'baz' }, true);
    s.foo = 2;
    expect(subscriber).toHaveBeenCalledTimes(2);
    expect(subscriber).toHaveBeenCalledWith({ foo: 2, bar: 'baz' }, false);
    s.bar = 'new bar';
    expect(subscriber).toHaveBeenCalledTimes(3);
    expect(subscriber).toHaveBeenCalledWith({ foo: 2, bar: 'new bar' }, false);
    unsubscribe();
  });

  it('Subscribe with override selector', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const subscriber = jest.fn(({ foo }, init) => {});
    const s = simpleState({ foo: 1, bar: 'baz' });
    const unsubscribe = s.subscribe(subscriber, ['bar']);
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith({ foo: 1, bar: 'baz' }, true);
    s.foo = 2;
    expect(subscriber).toHaveBeenCalledTimes(1);
    s.bar = 'new bar';
    expect(subscriber).toHaveBeenCalledTimes(2);
    expect(subscriber).toHaveBeenCalledWith({ foo: 2, bar: 'new bar' }, false);
    unsubscribe();
  });
});
