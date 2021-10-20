const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { Server } = require("http");

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, '/build'),
        filename: 'index_bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    plugins: [
        new htmlWebpackPlugin({
            title: 'react template',
            template: './src/index.html'
        })
    ]
}