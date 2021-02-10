const path = require('path')
const SizePlugin = require('size-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
	devtool: 'source-map',
	stats: 'errors-only',
	entry: {
		background: './src/background',
		options: './src/options',
		'plantuml-extension': './src/plantuml-extension',
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
		],
	},
	plugins: [
		new SizePlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: '**/*',
					context: 'src',
					globOptions: {
						ignore: ['*.js'],
					},
				},
				{
					from: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
				},
				{
					from: 'node_modules/webext-base-css/webext-base.css',
				},
			],
		}),
	],
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					mangle: false,
					compress: false,
					output: {
						beautify: true,
						indent_level: 2, // eslint-disable-line camelcase
					},
				},
			}),
		],
	},
}
