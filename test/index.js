/* globals globalThis:false */

import assert from 'assert';
import setImmediateShim from 'set-immediate-shim';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import {
	setTimeout as setTimeoutPromise,
	setImmediate as setImmediatePromise,
	setInterval as setIntervalPromise
} from '../index';

if (!globalThis.setImmediate) {
	globalThis.setImmediate = setImmediateShim;
	globalThis.clearImmediate = function () {};
}

const symbolAsyncIterator =
	Symbol?.asyncIterator ?? Symbol?.iterator ?? '@@asyncIterator';

before(function () {
	window.fixture.load('/test/fixtures/index.html');
});

after(function () {
	window.fixture.cleanup();
});

describe('setTimeout', function () {
	it('should handle case with value', async function () {
		const start = new Date();
		const result = await setTimeoutPromise(1000, 'becky');
		const end = new Date();
		assert.ok(end - start >= 1000);
		assert.equal(result, 'becky');
	});

	it('should handle case with no value', async function () {
		const result = await setTimeoutPromise(0);
		assert.equal(typeof result, 'undefined');
	});

	it('should handle aborted operation after promise', async function () {
		const controller = new AbortController();
		const start = new Date();
		const promise = setTimeoutPromise(10_000, 'becky', {
			signal: controller.signal
		});
		controller.abort();
		try {
			await promise;
		} catch (error) {
			const end = new Date();
			assert.equal(error.name, 'AbortError');
			assert.ok(end - start < 1000);
		}
	});

	it('should handle aborted operation before promise', async function () {
		const controller = new AbortController();
		controller.abort();
		const start = new Date();
		const promise = setTimeoutPromise(10_000, 'becky', {
			signal: controller.signal
		});
		try {
			await promise;
		} catch (error) {
			const end = new Date();
			assert.equal(error.name, 'AbortError');
			assert.ok(end - start < 1000);
		}
	});

	it('should not throw after resolving promise and calling abort', async function () {
		const controller = new AbortController();
		const promise = setTimeoutPromise(10, 'becky', {
			signal: controller.signal
		});
		const result = await promise;
		controller.abort();
		assert.ok(result, 'becky');
	});

	it('should validate options', async function () {
		await Promise.all(
			[1, '', false, Infinity].map(async (options) => {
				try {
					await setTimeoutPromise(1000, 'becky', options);
				} catch (error) {
					assert.equal(error.code, 'ERR_INVALID_ARG_TYPE');
				}
			})
		);
	});

	it('should validate options.signal', async function () {
		await Promise.all(
			[1, '', false, Infinity, null, {}].map(async (signal) => {
				try {
					await setTimeoutPromise(1000, 'becky', { signal });
				} catch (error) {
					assert.equal(error.code, 'ERR_INVALID_ARG_TYPE');
				}
			})
		);
	});

	it('should validate options.ref', async function () {
		await Promise.all(
			[1, '', Infinity, null, {}].map(async (reference) => {
				try {
					await setTimeoutPromise(1000, 'becky', { ref: reference });
				} catch (error) {
					assert.equal(error.code, 'ERR_INVALID_ARG_TYPE');
				}
			})
		);
	});
});

describe('setImmediate', function () {
	it('should handle case with value', async function () {
		const result = await setImmediatePromise('becky');
		assert.equal(result, 'becky');
	});

	it('should handle case with no value', async function () {
		const result = await setImmediatePromise();
		assert.equal(typeof result, 'undefined');
	});

	it('should handle aborted operation after promise', async function () {
		const controller = new AbortController();
		const start = new Date();
		const promise = setImmediatePromise('becky', {
			signal: controller.signal
		});
		controller.abort();
		try {
			await promise;
		} catch (error) {
			const end = new Date();
			assert.equal(error.name, 'AbortError');
			assert.ok(end - start < 1000);
		}
	});

	it('should handle aborted operation before promise', async function () {
		const controller = new AbortController();
		controller.abort();
		const start = new Date();
		const promise = setImmediatePromise('becky', {
			signal: controller.signal
		});
		try {
			await promise;
		} catch (error) {
			const end = new Date();
			assert.equal(error.name, 'AbortError');
			assert.ok(end - start < 1000);
		}
	});

	it('should not throw after resolving promise and calling abort', async function () {
		const controller = new AbortController();
		const promise = setImmediatePromise('becky', {
			signal: controller.signal
		});
		const result = await promise;
		controller.abort();
		assert.ok(result, 'becky');
	});

	it('should validate options', async function () {
		await Promise.all(
			[1, '', false, Infinity].map(async (options) => {
				try {
					await setImmediatePromise('becky', options);
				} catch (error) {
					assert.equal(error.code, 'ERR_INVALID_ARG_TYPE');
				}
			})
		);
	});

	it('should validate options.signal', async function () {
		await Promise.all(
			[1, '', false, Infinity, null, {}].map(async (signal) => {
				try {
					await setImmediatePromise('becky', { signal });
				} catch (error) {
					assert.equal(error.code, 'ERR_INVALID_ARG_TYPE');
				}
			})
		);
	});

	it('should validate options.ref', async function () {
		await Promise.all(
			[1, '', Infinity, null, {}].map(async (reference) => {
				try {
					await setImmediatePromise('becky', { ref: reference });
				} catch (error) {
					assert.equal(error.code, 'ERR_INVALID_ARG_TYPE');
				}
			})
		);
	});
});

describe('setInterval', function () {
	async function runInterval(function_, intervalTime, signal) {
		const input = 'becky';
		const interval = setIntervalPromise(intervalTime, input, {
			signal
		});
		let iteration = 0;
		for await (const value of interval) {
			assert.equal(value, input);
			iteration++;
			await function_(iteration);
		}
	}

	it('should handle case with value', async function () {
		const iterable = setIntervalPromise(1, 'becky');
		const iterator = iterable[symbolAsyncIterator]();
		const promise = iterator.next();

		const result = await promise;
		assert.ok(!result.done, 'iterator was wrongly marked as done');
		assert.equal(result.value, 'becky');

		return iterator.return();
	});

	it('should handle case with no value', async function () {
		const iterable = setIntervalPromise(0);
		const iterator = iterable[symbolAsyncIterator]();
		const promise = iterator.next();

		const result = await promise;
		assert.ok(!result.done, 'iterator was wronlgy marked as done');
		assert.equal(typeof result.value, 'undefined');

		return iterator.return();
	});

	it('should handle multiple iterations', async function () {
		const iterable = setIntervalPromise(1, 'becky');
		const iterator = iterable[symbolAsyncIterator]();
		const promise = iterator.next();

		let result = await promise;
		assert.ok(!result.done, 'iterator was wrongly marked as done');
		assert.equal(result.value, 'becky');
		result = await iterator.next();
		assert.ok(!result.done, 'iterator was wrongly marked as done');
		assert.equal(result.value, 'becky');

		return iterator.return();
	});

	it('should handle aborted operation after promise', async function () {
		const controller = new AbortController();

		const iterable = setIntervalPromise(100, 'becky', {
			signal: controller.signal
		});
		const iterator = iterable[symbolAsyncIterator]();
		const promise = iterator.next();

		controller.abort();

		try {
			await promise;
		} catch (error) {
			assert.equal(error.name, 'AbortError');
		}
	});

	it('should handle aborted operation before promise', async function () {
		const controller = new AbortController();
		controller.abort();

		const iterable = setIntervalPromise(1, 'becky', {
			signal: controller.signal
		});
		const iterator = iterable[symbolAsyncIterator]();
		const promise = iterator.next();

		try {
			await promise;
		} catch (error) {
			assert.equal(error.name, 'AbortError');
		}
	});

	it('should not throw after resolving promise and calling abort', async function () {
		const controller = new AbortController();

		const iterable = setIntervalPromise(1, 'becky', {
			signal: controller.signal
		});
		const iterator = iterable[symbolAsyncIterator]();
		const promise = iterator.next();

		const result = await promise;
		controller.abort();
		assert.ok(result, 'becky');
	});

	it('checks that we call the correct amount of times', async function () {
		const controller = new AbortController();
		let loopCount = 0;
		const delay = 20;
		const timeoutLoop = runInterval(
			async () => {
				loopCount++;
				if (loopCount === 5) {
					controller.abort();
				}
				if (loopCount > 5) {
					throw new Error('ran too many times');
				}
			},
			delay,
			controller.signal
		);

		try {
			await timeoutLoop;
		} catch (error) {
			assert.equal(error.name, 'AbortError');
			assert.equal(loopCount, 5);
		}
	});

	it('checks that if we abort when we have some unresolved callbacks, we actually call them', async function () {
		const controller = new AbortController();
		const delay = 10;
		let totalIterations = 0;
		const timeoutLoop = runInterval(
			async (iterationNumber) => {
				await setTimeoutPromise(delay * 4);
				if (iterationNumber <= 2) {
					assert.equal(controller.signal.aborted, false);
				}
				if (iterationNumber === 2) {
					controller.abort();
				}
				if (iterationNumber > 2) {
					assert.equal(controller.signal.aborted, true);
				}
				if (iterationNumber > totalIterations) {
					totalIterations = iterationNumber;
				}
			},
			delay,
			controller.signal
		);

		try {
			await timeoutLoop;
		} catch (error) {
			assert.ok(
				totalIterations >= 3,
				`iterations was ${totalIterations} < 3`
			);
		}
	});

	it('checks that the timing is correct', async function () {
		let pre = false;
		let post = false;
		const timeUnit = 50;

		await Promise.all([
			(async () => {
				await setTimeoutPromise(1);
				pre = true;
			})(),
			new Promise((resolve) => {
				const iterable = setIntervalPromise(timeUnit * 2);
				const iterator = iterable[symbolAsyncIterator]();

				iterator
					.next()
					.then(() => {
						assert.ok(pre, 'interval ran too early');
						assert.ok(!post, 'interval ran too late');
						return iterator.next();
					})
					.then(() => {
						assert.ok(post, 'second interval ran too early');
						return iterator.return();
					})
					.then(resolve);
			}),
			(async () => {
				await setTimeoutPromise(timeUnit * 3);
				post = true;
			})()
		]);
	});

	it('should validate options', async function () {
		await Promise.all(
			[1, '', false, Infinity].map(async (options) => {
				const iterable = setIntervalPromise(1000, 'becky', options);
				const iterator = iterable[symbolAsyncIterator]();
				const promise = iterator.next();
				try {
					await promise;
				} catch (error) {
					assert.equal(error.code, 'ERR_INVALID_ARG_TYPE');
				}
			})
		);
	});

	it('should validate options.signal', async function () {
		await Promise.all(
			[1, '', false, Infinity, null, {}].map(async (signal) => {
				const iterable = setIntervalPromise(1000, 'becky', { signal });
				const iterator = iterable[symbolAsyncIterator]();
				const promise = iterator.next();
				try {
					await promise;
				} catch (error) {
					assert.equal(error.code, 'ERR_INVALID_ARG_TYPE');
				}
			})
		);
	});

	it('should validate options.ref', async function () {
		await Promise.all(
			[1, '', Infinity, null, {}].map(async (reference) => {
				const iterable = setIntervalPromise(1000, 'becky', {
					ref: reference
				});
				const iterator = iterable[symbolAsyncIterator]();
				const promise = iterator.next();
				try {
					await promise;
				} catch (error) {
					assert.equal(error.code, 'ERR_INVALID_ARG_TYPE');
				}
			})
		);
	});

	it('should handle example from documentation', async function () {
		let count = 0;
		for await (const startTime of setIntervalPromise(100, Date.now())) {
			const now = Date.now();
			count = count + 1;
			if (now - startTime >= 1000) {
				break;
			}
		}
		assert.equal(count, 10);
	});
});
