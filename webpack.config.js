/**
 * @file webpack config
 * @author clark-t (clarktanglei@163.com)
 */

/* eslint-disable no-var */

var glob = require('glob');
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var mode = process.env.NODE_ENV || 'development';

var caseEntryFiles = glob.sync('./cases/**/+(index|sw*).js');

var caseIndexFiles = caseEntryFiles.filter(function (filePath) {
    return path.basename(filePath).indexOf('sw') !== 0;
});


/* eslint-disable no-console */
console.log('\x1b[35m%s\x1b[0m', '[' + new Date().toLocaleString() + ']', '--webpack start');
/* eslint-enable no-console */

module.exports = {

    // entry include
    // 1. client entry js
    // 2. all the test case entry js
    // 3. all the test case service worker entry js
    entry: caseEntryFiles.reduce(
        function (result, filePath) {
            let caseName = filePath.replace(/\.js$/, '').slice(2);
            result[caseName] = filePath;
            return result;
        },
        {
            index: './client/index.js'
        }
    ),
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist')
    },
    // devtool: mode === 'development' ? '#eval-source-map' : false,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['es2015'],
                            ['stage-2']
                        ],
                        plugins: ['transform-runtime']
                    }
                }]
            },
            {
                test: /\.styl$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'stylus-loader']
                })
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader']
                })
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: 'url-loader?limit=10000&name=img/[name]-[hash].[ext]'
            },
            {
                test: /\.(otf|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                use: 'url-loader?limit=10000&name=font/[name]-[hash].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {

                NODE_ENV: '"' + mode + '"',

                // pwa feature test cases html entry list
                CASE_ENTRY_LIST: JSON.stringify(
                    caseIndexFiles.map(function (filePath) {
                        return filePath.slice(1).replace(/js$/, 'html');
                    })
                )
            }
        }),
        new ExtractTextPlugin({
            filename: '[name].css'
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, './static'),
            to: path.resolve(__dirname, './dist'),
            ignore: '.gitkeep'
        }]),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            chunks: ['index']
        })
    ]
    .concat(
        caseIndexFiles.map(function (filePath) {
            var caseName = filePath.replace(/\.js$/, '').slice(2);
            return new HtmlWebpackPlugin({
                filename: caseName + '.html',
                chunks: [caseName]
            });
        })
    )
};
