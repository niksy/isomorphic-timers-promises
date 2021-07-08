# isomorphic-timers-promises

[![Build Status][ci-img]][ci]
[![Browser testing by BrowserStack][browserstack-img]][browserstack]

[`timers/promises`](https://nodejs.org/api/timers.html#timers_timers_promises_api)
for client and server.

> The `timers/promises` API provides an alternative set of timer functions that
> return `Promise` objects.

## Install

```sh
npm install isomorphic-timers-promises --save
```

## Usage

```js
import {
	setTimeout,
	setImmediate,
	setInterval
} from 'isomorphic-timers-promises';

(async () => {
	const result = await setTimeout(100, 'becky');
	console.log(result); // 'becky'
})();

(async () => {
	const result = await setImmediate('maya');
	console.log(result); // 'maya'
})();

(async () => {
	let result = 0;
	for await (const startTime of setInterval(100, Date.now())) {
		const now = Date.now();
		result = result + 1;
		if (now - startTime >= 1000) {
			break;
		}
	}
	console.log(result); // 10
})();
```

### Usage with Webpack

<details>
	
<summary>Show me</summary>

```js
// webpack.config.js
module.exports = {
	// ...
	resolve: {
		alias: {
			'timers/promises': 'isomorphic-timers-promises'
		}
	}
};
```

</details>

### Usage with Rollup

<details>
	
<summary>Show me</summary>

```js
// rollup.config.js
const { default: resolve } = require('@rollup/plugin-node-resolve');
const alias = require('@rollup/plugin-alias');

module.exports = {
	// ...
	plugins: [
		resolve(),
		alias({
			entries: {
				'timers/promises': 'isomorphic-timers-promises'
			}
		})
	]
};
```

</details>

### Usage in Node

<details>
	
<summary>Show me</summary>

Depending on your configuration you can alias `timers/promises` with packages
like [`link-module-alias`](https://github.com/Rush/link-module-alias) or
[`babel-plugin-module-resolver`](https://github.com/tleunen/babel-plugin-module-resolver).

</details>

## API

### setTimeout([delay[, value[, options]]])

Returns: `Promise`

| Property         | Type          | Default | Description                                                                                                                                  |
| ---------------- | ------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `delay`          | `number`      | `1`     | The number of milliseconds to wait before fulfilling the promise.                                                                            |
| `value`          | `*`           |         | A value with which the promise is fulfilled.                                                                                                 |
| `options.ref`    | `boolean`     | `true`  | Set to `false` to indicate that the scheduled timeout should not require the event loop to remain active. Valid only for server environment. |
| `options.signal` | `AbortSignal` |         | An optional `AbortSignal` that can be used to cancel the scheduled timeout.                                                                  |

### setImmediate([value[, options]])

Returns: `Promise`

| Property         | Type          | Default | Description                                                                                                                                    |
| ---------------- | ------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`          | `*`           |         | A value with which the promise is fulfilled.                                                                                                   |
| `options.ref`    | `boolean`     | `true`  | Set to `false` to indicate that the scheduled immediate should not require the event loop to remain active. Valid only for server environment. |
| `options.signal` | `AbortSignal` |         | An optional `AbortSignal` that can be used to cancel the scheduled immediate.                                                                  |

### setInterval([delay[, value[, options]]])

Returns: async iterator that generates values in an interval of `delay`.

| Property         | Type          | Default | Description                                                                                                                                                     |
| ---------------- | ------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `delay`          | `number`      | `1`     | The number of milliseconds to wait between iterations.                                                                                                          |
| `value`          | `*`           |         | A value with which the iterator returns.                                                                                                                        |
| `options.ref`    | `boolean`     | `true`  | Set to `false` to indicate that the scheduled timeout between iterations should not require the event loop to remain active. Valid only for server environment. |
| `options.signal` | `AbortSignal` |         | An optional `AbortSignal` that can be used to cancel the scheduled timeout between operations.                                                                  |

## Node and browser support

Supports Node 10+.

Tested in Chrome 72, Firefox 65, Internet Explorer 11 and should work in all
modern browsers.

Check
[support based on Browserslist configuration](https://browserslist.dev/?q=bGFzdCAzIG1ham9yIHZlcnNpb25zLCBzaW5jZSAyMDE5LCBub3QgaWUgPD0gMTAsIG5vZGUgMTA%3D).

Assumes `Promise`, `AbortController` and `setImmediate` are polyfilled or
available in global context.

## Test

For automated tests, run `npm run test:automated` (append `:watch` for watcher
support).

Test suite is taken and modified from official Node.js repository
([`setTimeout`](https://github.com/nodejs/node/blob/master/test/parallel/test-timers-timeout-promisified.js),
[`setImmediate`](https://github.com/nodejs/node/blob/master/test/parallel/test-timers-immediate-promisified.js),
[`setInterval`](https://github.com/nodejs/node/blob/master/test/parallel/test-timers-interval-promisified.js)).

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

<!-- prettier-ignore-start -->

[ci]: https://travis-ci.com/niksy/isomorphic-timers-promises
[ci-img]: https://travis-ci.com/niksy/isomorphic-timers-promises.svg?branch=master
[browserstack]: https://www.browserstack.com/
[browserstack-img]: https://img.shields.io/badge/browser%20testing-BrowserStack-informational?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPGRlZnMvPgogIDxyYWRpYWxHcmFkaWVudCBpZD0iYSIgY3g9IjIwLjk0Mjk3NiIgY3k9IjI4LjA5NDY3ODczIiByPSIzLjc5MTM0MTQxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM3OTc5NzkiLz4KICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzRjNGM0YyIvPgogIDwvcmFkaWFsR3JhZGllbnQ+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI5LjcyOTIwNCAtNTcuMTg3NjExKSBzY2FsZSgyLjk3MjkyKSI+CiAgICA8Y2lyY2xlIGN4PSIyMC43ODkiIGN5PSIzMC4wMjUiIHI9IjEwLjczOSIgZmlsbD0iI2Y0Yjk2MCIvPgogICAgPGNpcmNsZSBjeD0iMTkuNyIgY3k9IjI4LjkzNiIgcj0iOS43IiBmaWxsPSIjZTY2ZjMyIi8+CiAgICA8Y2lyY2xlIGN4PSIyMS4wMzYiIGN5PSIyNy42OTkiIHI9IjguNDEzIiBmaWxsPSIjZTQzYzQxIi8+CiAgICA8Y2lyY2xlIGN4PSIyMS42NzkiIGN5PSIyOC4zNDIiIHI9IjcuNzIiIGZpbGw9IiNiZGQwNDEiLz4KICAgIDxjaXJjbGUgY3g9IjIxLjEzNSIgY3k9IjI4LjkzNiIgcj0iNy4xNzYiIGZpbGw9IiM2ZGI1NGMiLz4KICAgIDxjaXJjbGUgY3g9IjE5Ljk5NyIgY3k9IjI3Ljc0OCIgcj0iNS45ODgiIGZpbGw9IiNhZWRhZTYiLz4KICAgIDxjaXJjbGUgY3g9IjIwLjkzNyIgY3k9IjI2Ljc1OCIgcj0iNS4wNDgiIGZpbGw9IiM1NmI4ZGUiLz4KICAgIDxjaXJjbGUgY3g9IjIxLjU4IiBjeT0iMjcuNDUxIiByPSI0LjQwNSIgZmlsbD0iIzAwYjFkNSIvPgogICAgPGNpcmNsZSBjeD0iMjAuOTM3IiBjeT0iMjguMDQ1IiByPSIzLjc2MSIgZmlsbD0idXJsKCNhKSIvPgogICAgPGNpcmNsZSBjeD0iMjAuOTM3IiBjeT0iMjguMDQ1IiByPSIzLjc2MSIgZmlsbD0iIzIyMWYxZiIvPgogICAgPGVsbGlwc2UgY3g9Ii0xNS4xNTkiIGN5PSIzMS40MDEiIGZpbGw9IiNmZmYiIHJ4PSIxLjE4OCIgcnk9Ii43NDIiIHRyYW5zZm9ybT0icm90YXRlKC02NS44MzQpIi8+CiAgPC9nPgo8L3N2Zz4K

<!-- prettier-ignore-end -->
