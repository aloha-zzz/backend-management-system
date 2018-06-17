var webpack = require('webpack')
var uglifyjs = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: "./static/index.jsx",
    output: {
        filename: "./bundle.js",
        path: __dirname + "/dist",
        publicPath: "/dist"
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".jsx", ".js"]
    },
    module: {
        loaders: [{
                test: /\.jsx|\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['env', 'react'],
                    plugins: [ 
                        ["import", {
                            libraryName: "antd",// 需要配置的地方
                            style: "css"
                        }]
                    ] 
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({  
            'process.env.NODE_ENV': JSON.stringify('production')  
        }),
        new uglifyjs(),
    ]
}