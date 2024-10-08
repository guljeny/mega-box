type TSub<T> = (half: Partial<T>, init: boolean) => void;
type TUnsub = () => void;

type TProxiedManager<T = {}> = T & {
  put: (half: Partial<T>) => void;
  subscribe: (cb: TSub<T>, filter?: TFilter) => TUnsub;
  unsubscribe: (cb: TSub<T>) => TUnsub;
}

type TFilter = false | string[];

interface IListener<T> {
  selector: TFilter;
  cb: TSub<T>;
}

type TPlugin<T, R = unknown> = (state: TProxiedManager<T>) => R;

export const megaBox = <T extends object, N extends Record<string, TPlugin<T>>>(
  initail: T,
  plugins?: N,
) => {
  let listeners: IListener<T>[] = [];
  let state = initail;

  const notify = (keys: string[]) => {
    listeners.forEach(({ selector, cb }) => {
      if (!selector) return cb(state, false);
      if (!keys.some(key => selector.includes(key))) return;
      cb(state, false);
    });
  };

  const unsubscribe = (cb: TSub<T>) => {
    listeners = listeners.filter(l => l.cb !== cb);
  };

  const subscribe = (cb: TSub<T>, filter?: TFilter) => {
    const keys: string[] = [];

    const pickerProxy = new Proxy(state, {
      get: (target, key) => {
        keys.push(String(key));

        return target[key];
      },
    }) as T;

    cb(pickerProxy, true);

    const selector = filter !== undefined ? filter : [...keys];

    // Fixing selector for situations when picked
    // keys has been conditionally changed
    listeners.push({ selector, cb });

    return () => unsubscribe(cb);
  };

  const put = (half: Partial<T>) => {
    state = { ...state, ...half };
    notify(Object.keys(half));
  };

  const proxy = new Proxy({}, {
    set: function (_, key, value) {
      state[key] = value;
      notify([String(key)]);

      return true;
    },
    get: function (_, key) {
      if (key === 'put') return put;
      if (key === 'subscribe') return subscribe;
      if (key === 'unsubscribe') return unsubscribe;
      if (plugins?.[String(key)]) return plugins[String(key)](proxy);

      return state[key];
    },
  }) as TProxiedManager<T> & {[K in keyof N]: ReturnType<N[K]>;};

  return proxy;
};
