require('dotenv').config();
process.title = 'blueprints';
const path = require('path');
const Dotenv = require('dotenv-webpack');
const glob = require('glob');


module.exports = {
    webpack: (config) => {
        config.plugins = [
            ...config.plugins,
            new Dotenv({
                path: path.join(__dirname, '.env'),
                systemvars: true
            })
        ];
        config.module.rules.push(
            {
                test: /\.(css|scss)/,
                loader: 'emit-file-loader',
                options: {
                    name: 'dist/[path][name].[ext]'
                }
            }
            ,
            {
                test: /\.css$/,
                use: ['babel-loader', 'raw-loader', 'postcss-loader']
            }
            ,
            {
                test: /\.s(a|c)ss$/,
                use: ['babel-loader', 'raw-loader', 'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: ['styles']
                                .map((d) => path.join(__dirname, d))
                                .map((g) => glob.sync(g))
                                .reduce((a, c) => a.concat(c), [])
                        }
                    }
                ]
            }
        );
        config.node = {fs: 'empty'};
        config.plugins = config.plugins.filter(plugin => {
            return plugin.constructor.name !== 'UglifyJsPlugin';
        });
        return config;
    }
};
