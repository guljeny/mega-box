import { megaBox } from '../megaBox';

describe('state', () => {
  it('Initialize and get value', () => {
    const s = megaBox({ foo: 'bar' });
    expect(s.foo).toBe('bar');
  });

  it('Set value', () => {
    const s = megaBox({ foo: 'bar' });
    s.foo = 'baz';
    expect(s.foo).toBe('baz');
  });

  it('Put', () => {
    const s = megaBox({ foo: 1, bar: 'baz' });
    s.put({ foo: 2 });
    expect(s.foo).toBe(2);
    expect(s.bar).toBe('baz');
  });

  it('Subscribe and unsubscribe', () => {
    const subscriber = jest.fn(() => {});
    const s = megaBox({ foo: 1 });
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
    const s = megaBox({ foo: 1, bar: 'baz' });
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
    const s = megaBox({ foo: 1, bar: 'baz' });
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
    const s = megaBox({ foo: 1, bar: 'baz' });
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
    const s = megaBox({ foo: 1, bar: 'baz' });
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

  it('Register plugin', () => {
    const subscriber = jest.fn();

    const plugin = jest.fn(state => () => {
      const unsubscribe = state.subscribe(subscriber, ['foo']);

      return unsubscribe;
    });

    const s = megaBox({ foo: 1 }, {
      fooSub: plugin,
    });

    expect(plugin).toHaveBeenCalledTimes(0);
    expect(subscriber).toHaveBeenCalledTimes(0);

    s.foo = 2;

    expect(plugin).toHaveBeenCalledTimes(0);
    expect(subscriber).toHaveBeenCalledTimes(0);

    const unsubPlugin = s.fooSub();

    expect(plugin).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledTimes(1);

    s.foo = 3;

    expect(plugin).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledTimes(2);

    unsubPlugin();

    s.foo = 4;

    expect(plugin).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledTimes(2);
  });
});
