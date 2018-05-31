const webpack = require('webpack');
const path = require('path');

const isProduction = process.env.NODE_ENV == 'production' ? true : false;

const webpack_config = {
	plugins: [],
	module: {
		loaders: []
	}
};

webpack_config.entry = {
	'scroll-lock': './src/scroll-lock.js',
};

if(isProduction) {
	webpack_config.entry['scroll-lock.min'] = './src/scroll-lock.js';
}

webpack_config.output = {
	path: path.resolve(__dirname, 'dist'),
	filename: '[name].js',
	library: 'scrollLock',
	libraryTarget: 'umd',
};

webpack_config.plugins.push(
	new webpack.DefinePlugin({ isProduction })
);

webpack_config.module.loaders.push({
	test: /\.js$/,
	exclude: ['node_modules'],
	loaders: [
		{
			loader: 'babel-loader',
			options: {
				presets: ['es2015', 'stage-2']
			}
		},

	]
});

if(!isProduction) {
	const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
	webpack_config.plugins.push(
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 1337,
			files: [
                './dist/**/*',
				'./demos/**/*',
			],
			server: {
				baseDir: ['./'],
				index: '/demos/index.html'
			}
		})
	);

	webpack_config.watch = true;
	webpack_config.watchOptions = {
		aggregateTimeout: 100,
		ignored: /node_modules/
	};

	webpack_config.devtool = 'cheap-inline-module-source-map';
}
else {
	webpack_config.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			include: /\.min\.js$/,
			minimize: true,
			beautify: false,
			sourceMap: false,
			compress: { warnings: false },
			output: { comments: false }
		})
	);
}


module.exports = webpack_config;