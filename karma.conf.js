'use strict';

const path = require('path');
const fs = require('fs');
const { default: resolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const nodeBuiltins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const { default: babel } = require('@rollup/plugin-babel');
const istanbul = require('rollup-plugin-istanbul');
const rollupConfig = require('./rollup.config');

let config;

const isCI =
	typeof process.env.CI !== 'undefined' && process.env.CI !== 'false';
const isPR =
	typeof process.env.TRAVIS_PULL_REQUEST !== 'undefined' &&
	process.env.TRAVIS_PULL_REQUEST !== 'false';
const local = !isCI || (isCI && isPR);

const port = 0;

if (local) {
	config = {
		browsers: ['Chrome']
	};
} else {
	config = {
		hostname: 'bs-local.com',
		browserStack: {
			username: process.env.BROWSER_STACK_USERNAME,
			accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
			startTunnel: true,
			project: 'isomorphic-timers-promises',
			name: 'Automated (Karma)',
			build: 'Automated (Karma)'
		},
		customLaunchers: {
			'BS-Chrome': {
				'base': 'BrowserStack',
				'project': 'isomorphic-timers-promises',
				'build': 'Automated (Karma)',
				'browser': 'Chrome',
				'browser_version': '72',
				'name': 'Chrome',
				'os': 'Windows',
				'os_version': '7'
			},
			'BS-Edge': {
				'base': 'BrowserStack',
				'project': 'isomorphic-timers-promises',
				'build': 'Automated (Karma)',
				'browser': 'Edge',
				'browser_version': '15',
				'name': 'Edge',
				'os': 'Windows',
				'os_version': '10'
			},
			'BS-Firefox': {
				'base': 'BrowserStack',
				'project': 'isomorphic-timers-promises',
				'build': 'Automated (Karma)',
				'browser': 'Firefox',
				'browser_version': '65',
				'name': 'Firefox',
				'os': 'Windows',
				'os_version': '7'
			}
		},
		browsers: ['BS-Chrome', 'BS-Edge', 'BS-Firefox']
	};
}

module.exports = function (baseConfig) {
	baseConfig.set({
		basePath: '',
		frameworks: ['mocha', 'fixture'],
		files: ['test/**/*.html', { pattern: 'test/**/*.js', watched: false }],
		exclude: [],
		preprocessors: {
			'test/**/*.html': ['html2js'],
			'test/**/*.js': ['rollup', 'sourcemap']
		},
		reporters: ['mocha', 'coverage-istanbul'],
		port: port,
		colors: true,
		logLevel: baseConfig.LOG_INFO,
		autoWatch: false,
		client: {
			captureConsole: true
		},
		browserConsoleLogOptions: {
			level: 'log',
			format: '%b %T: %m',
			terminal: true
		},
		rollupPreprocessor: {
			plugins: [
				nodeBuiltins(),
				babel({
					exclude: 'node_modules/**',
					babelHelpers: 'runtime'
				}),
				resolve({
					preferBuiltins: true
				}),
				commonjs(),
				babel({
					include: 'node_modules/{has-flag,supports-color}/**',
					babelHelpers: 'runtime',
					babelrc: false,
					configFile: path.resolve(__dirname, '.babelrc')
				}),
				globals(),
				...rollupConfig.plugins.filter(
					({ name }) => !['babel'].includes(name)
				),
				istanbul({
					exclude: ['test/**/*.js', 'node_modules/**/*']
				})
			],
			output: {
				format: 'iife',
				name: 'isomorphicTimersPromises',
				sourcemap: baseConfig.autoWatch ? false : 'inline', // Source map support has weird behavior in watch mode
				intro: 'window.TYPED_ARRAY_SUPPORT = false;' // IE9
			}
		},
		coverageIstanbulReporter: {
			dir: path.join(__dirname, 'coverage/%browser%'),
			fixWebpackSourcePaths: true,
			reports: ['html', 'text'],
			thresholds: {
				global: JSON.parse(
					fs.readFileSync(path.join(__dirname, '.nycrc'), 'utf8')
				)
			}
		},
		singleRun: true,
		concurrency: Infinity,
		...config
	});
};
