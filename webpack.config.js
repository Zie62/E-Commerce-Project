const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    //1 entry point for each page and its associated js parent file.
    entry: {
        index: './src/index.js', products: './src/products.js',
        listing: './src/singleListing.js', cart: './src/cartPage.js',
        login: './src/login.js', register: './src/register.js',
        orders: './src/account.js'
    },
    output: {
        path: path.join(__dirname, '/build'),
        filename: '[name].bundle.js'
    },
    //makes sure appropriate .js and .css files are integrated into the compiled files
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
                ['style-loader', 'css-loader']
        }]
    },
    /*each plugin is 1 webpage. This can be consolidated into 1 JS file that conditionally
    renders components based on checking the path of the URL (also known as a SPA), but i
    decided to not do that.*/
    plugins: [
        new htmlWebpackPlugin({
            title: 'home page',
            template: './src/index.html',
            inject: true,
            chunks: ['index'],
            /*this is not called index.html as that name causes express to 
            generate default base route behaviour which prevents custom
            definition for function calls.*/
            filename: 'windex.html'
        }),
        new htmlWebpackPlugin({
            title: 'product page',
            template: './src/index.html',
            inject: true,
            chunks: ['products'],
            filename: 'products.html'
        }),
        new htmlWebpackPlugin({
            title: 'listing page',
            template: './src/index.html',
            inject: true,
            chunks: ['listing'],
            filename: 'singleListing.html'
        }),
        new htmlWebpackPlugin({
            title: 'cart page',
            template: './src/index.html',
            inject: true,
            chunks: ['cart'],
            filename: 'cartPage.html'
        }),
        new htmlWebpackPlugin({
            title: 'login page',
            template: './src/index.html',
            inject: true,
            chunks: ['login'],
            filename: 'login.html'
        }),
        new htmlWebpackPlugin({
            title: 'registration page',
            template: './src/index.html',
            inject: true,
            chunks: ['register'],
            filename: 'register.html'
        }),
        new htmlWebpackPlugin({
            title: 'orders page',
            template: './src/index.html',
            inject: true,
            chunks: ['orders'],
            filename: 'account.html'
        })
    ]
}