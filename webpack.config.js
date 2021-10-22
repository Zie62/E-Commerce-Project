const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { Server } = require("http");

module.exports = {
    entry: {index: './src/index.js', products: './src/products.js'},
    output: {
        path: path.join(__dirname, '/build'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        },
        {
            test: /\.css$/,
            exclude: /node_modules/,
            use: 
                ['style-loader','css-loader']
        }]
    },
    plugins: [
        new htmlWebpackPlugin({
            title: 'react template',
            template: './src/index.html',
            inject: true,
            chunks:['index'],
            filename: 'index.html'
        }),
        new htmlWebpackPlugin({
            title: 'product page',
            template: './src/products.html',
            inject: true,
            chunks: ['products'],
            filename: 'products.html'
        })
    ]
}