var webpack = require('webpack');
var path = require('path');
var env = process.env.WEBPACK_ENV;

var DEV = path.resolve(__dirname, 'dev');
var OUTPUT = path.resolve(__dirname, 'output');

var config = {
	entry: DEV + '/index.jsx',
	output: {
		path: OUTPUT,
		filename: 'index.js'
	},
	externals: {
		'Config': JSON.stringify(require('./dev/config/config.json')),
		'React': 'react'
	},
	node: {
		fs: 'empty'
	},
	target: 'web',
	plugins: [
		new webpack.DefinePlugin({
	    	'process.env.NODE_ENV': '"development"'
	    }),
		new webpack.DefinePlugin({
			'process.env': {
		    	'NODE_ENV': '"development"'
		    }
		})
	],
	module: {
		loaders: [{
			include: DEV,
			loader: 'babel-loader'
		}]
	}
};

module.exports = config;