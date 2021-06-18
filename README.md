# isomorphic-timers-promises

[![Build Status][ci-img]][ci]
[![BrowserStack Status][browserstack-img]][browserstack]

`timers/promises` for client and server.

## Install

```sh
npm install isomorphic-timers-promises --save
```

## Usage

```js
// Module usage
```

More usage examples.

## API

### methodName(arg, [optionalArg])

Returns: `Mixed`

Method description.

#### arg

Type: `Mixed`

arg description.

#### optionalArg

Type: `Object`

optionalArg description.

##### prop1

Type: `String`  
Default: `'3'`

`prop1` description.

##### prop2

Type: `Number`  
Default: `3`

##### prop3

Type: `Number[]`  
Default: `[1, 2, 3]`

##### prop4

Type: `Number[]` `String[]`  
Default: `['1', '2', '3']`

`prop4` description.

##### prop5

Type: `Function`  
Default: `noop`

`prop5` description.

Function arguments:

-   **arg1** `String` arg1 description
-   **arg2** `Number` arg2 description
-   **arg3** `Element` `Boolean` arg3 description

> Alternative approach

| Property | Type                  | Default           | Description                                              |
| -------- | --------------------- | ----------------- | -------------------------------------------------------- |
| `prop1`  | `String`              | `'3'`             | `prop1` description.                                     |
| `prop2`  | `Number`              | `3`               | `prop2` description.                                     |
| `prop3`  | `Number[]`            | `[1, 2, 3]`       | `prop3` description.                                     |
| `prop4`  | `Number[]` `String[]` | `['1', '2', '3']` | `prop4` description.                                     |
| `prop5`  | `Function`            | `noop`            | `prop5` description. (No function arguments description) |

---

## Browser support

Tested in Chrome 72, Edge 15, Firefox 65 and should work in all modern browsers
([support based on Browserslist configuration](https://browserslist.dev/?q=bGFzdCAzIG1ham9yIHZlcnNpb25zLCBzaW5jZSAyMDE5LCBlZGdlID49IDE1LCBub3QgaWUgPiAw)).

## Test

For automated tests, run `npm run test:automated` (append `:watch` for watcher
support).

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

<!-- prettier-ignore-start -->

[ci]: https://travis-ci.com/niksy/isomorphic-timers-promises
[ci-img]: https://travis-ci.com/niksy/isomorphic-timers-promises.svg?branch=master
[browserstack]: https://www.browserstack.com/
[browserstack-img]: https://www.browserstack.com/automate/badge.svg?badge_key=<badge_key>

<!-- prettier-ignore-end -->
