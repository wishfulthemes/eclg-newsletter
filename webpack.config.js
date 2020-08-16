const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		'admin': [
			'./app/admin/index.js',
		],
	},
	output: {
		...defaultConfig.output,
		path: path.resolve(process.cwd(), 'app/build')
	},

};
