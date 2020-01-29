var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack')

module.exports = {
    entry: {
        // osme: './src/index.ts', // Main index,
        osme_demo: './osme_demo/index.js' // Demo index
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        library: 'osme',
        libraryTarget: 'umd'
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                // loader: 'awesome-typescript-loader',
                exclude: /(node_modules|bower_components)/
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new webpack.EnvironmentPlugin({
            STATIC_FILES_SUBFOLDER: false, // Set to other directory if NOT using webpack-dev-server
            DEBUG: false,
            DRAW_BOUNDING_BOX_ELEMENT: false //  Specifies the element to draw bounding boxes for (e.g. 'GraphicalLabels'). If 'all', bounding boxes are drawn for all elements.
        }),
        // add a demo page to the build folder
        new HtmlWebpackPlugin({
            template: 'osme_demo/index.html',
            favicon: 'osme_demo/favicon.ico',
            title: 'OSME Demo'
        })
    ],
    devServer: {
        contentBase: [
            path.join(__dirname, 'test/data'),
            path.join(__dirname, 'build'),
            path.join(__dirname, 'osme_demo')
        ],
        port: 9000,
        compress: false
    }
}
