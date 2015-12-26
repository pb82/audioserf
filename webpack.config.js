var path = require('path');

module.exports = {
    entry: "./private/app.js",
    output: {
        path: path.join(__dirname, "public", "js"),
        filename: "bundle.js"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel",
            query: {
                presets: ["es2015", "react"]
            }
        }]
    },
    resolve: {
        root: [path.join(__dirname, "bower_components")]
    },
    externals: {
        'react': 'React'
    }
};