/**
 * @file webpack config
 * @author clark-t (clarktanglei@163.com)
 */

/* eslint-disable no-var */

var glob = require('glob');
var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var mode = process.env.NODE_ENV || 'development';

var ROUTE_PREFIX = mode === 'development' ? '' : '/pwa-features-autotest';


var caseEntryFiles = glob.sync('./cases/**/+(index|sw*).js');

var caseIndexFiles = caseEntryFiles.filter(function (filePath) {
    return path.basename(filePath).indexOf('sw') !== 0;
});

/* eslint-disable no-console */
console.log('\x1b[35m%s\x1b[0m', '[' + new Date().toLocaleString() + ']', '--webpack start');
/* eslint-enable no-console */

var webpackConfig = {

    // entry include
    // 1. client entry js
    // 2. all the test case entry js
    // 3. all the test case service worker entry js
    entry: caseEntryFiles.reduce(
        function (result, filePath) {
            let caseName = filePath.replace(/\.js$/, '').slice(2);
            result[caseName] = filePath;

            let name = path.basename(filePath);

            if (name.indexOf('sw') === 0) {
                let rootSWName = caseName.split('/').slice(2).join('/');
                result[rootSWName] = filePath;
            }

            return result;
        },
        {
            index: './client/index.js',
            sequence: './client/sequence.js'
        }
    ),
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist')
    },
    resolve: {
        alias: {
            /* eslint-disable camelcase */
            'utils': path.resolve('./common/utils.js'),
            'store': path.resolve('./common/store.js'),
            'helper': path.resolve('./common/helper.js'),
            'base': path.resolve('./common/base.js'),
            'log': path.resolve('./common/log.js')
            /* eslint-enable camelcase */
        }
    },
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
                        plugins: [
                            'transform-runtime',
                            'add-module-exports'
                        ]
                    }
                }]
            },
            {
                test: /\.styl$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: mode === 'development'
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: mode === 'development' ? 'inline' : false
                            }
                        },
                        'stylus-loader'
                    ]
                })
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: mode === 'development'
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: mode === 'development' ? 'inline' : false
                            }
                        }
                    ]
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
                ROUTE_PREFIX: JSON.stringify(ROUTE_PREFIX)
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
            template: './client/index.html',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            filename: 'sequence.html',
            template: './client/index.html',
            chunks: ['sequence']
        })
        // new webpack.HotModuleReplacementPlugin()
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

if (mode === 'development') {
    Object.assign(webpackConfig, {
        devtool: 'source-map',
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            // host: 'localhost',
            port: 8081,
            inline: false
        }
    });
}

module.exports = webpackConfig;
