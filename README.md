# Mega Box

[![NPM](https://nodei.co/npm/mega-box.png?mini=true)](https://www.npmjs.com/package/mega-box)

Easy, lightweight and powerful state management tool designed as redux or mobX replacement.

## Install

`npm i -s mega-box`

# Why megaBox? 

- No reducers and middleware hell for large projects 
- Simple usage and small api but smart optimisation inside
- No boilerplate code
- Easy to share store cross prjects or packages

# Usage 

`megaBox(initialState: Object, plugins?: { [name]: (state: Object) => unknown })`

Start with creating sate:

```
const initailState = { userName: 'Jack John', userId: 123 };
const appState = megaBox(initialState);
```

Plugins can be passed by second argument. Each plugin is function which get state as single argument.

```
const onUserIdChange = state => (cb: () => void) => {
    return state.subscribe(cb, ['userId']);
}

const appState = megaBox(initialState, { onUserIdChange });

appState.onUserIdChange(() => {
    console.log('UserId is changed and this handled by plugin');
});
```

### Read value

To read value just get it from state as from object: 

```
const user = appState.user;
// or
const { user} = appState;
```

### Write single value

To write single value set it as in object:

```
appState.user = ‘John Smith’;
```

### Write many values at one time

To update few fields in state call `appState.put`:

```
appState.put({ user: 'John Smith', userId: 987 });
```

### Subscribe on changes

`appState.subscribe(callback, filter?: string[] | false)`

> Avoid to writing more than one value by setting them in state. Use `put` instead.  
  Every single write in state will call callback separately.

`callback` - required. Will be called immediately after subscription and when state changes. Callback receive `actual state` as first argument and `boolean` as second argument. Boolean specify if it called first time (`true`) or after something change (`false`).

`filter` - optional. Used to describe which state keys should be changed to invoke callback. Possible values:

- `false` - will disable filter at all and callback will be called every update
- `string[]` - specify keys to track changes
- Leave it empty to let `megaBox` automaticaly solve when call callback

MegaBox remember which values used in first subscriber callback call and optimize performance by calling callback only when those values are changed. 

> Use state distructurization and read required values at the start of callback function.  
  Avoid getting values in conditions, some conditions can be scipped at the first call and lead to bugs when listener don’t call when value is changed. 

To avoid callback execution when some values changed use `appState.<key>` instead of getting value from listener params. 

``` 
// Invoke callback every time when user is changed
appState.subscribe(({ user }) => {
  // Get value when the user changed but changing userId not invoke callback
  Const { userId } = appState;
});
```
