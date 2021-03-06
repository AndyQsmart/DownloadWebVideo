const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    target: 'electron-renderer',
    // resolve: {
    //     modules: [
    //         path.resolve(__dirname, 'node_modules'),
    //     ],
    // },
    entry: './src/index.js', //相对路径
    output: {
        path: path.resolve(__dirname, 'build'), //打包文件的输出路径
        // publicPath:"",//配置文件中引用的路径以／开头
        filename: 'static/[contenthash]bundle.js', //打包文件名
        chunkFilename: 'static/[name].[contenthash:8].js', //分块文件名
    },
    module: {
        rules: [ //配置加载器
            { //js
                test: /\.js$/, //配置要处理的文件格式，一般使用正则表达式匹配
                loader: 'babel-loader?cacheDirectory=true', //使用的加载器名称
                query: { //babel的配置参数，可以写在.babelrc文件里也可以写在这里
                    presets: ['@babel/preset-env', "@babel/preset-react"],
                    plugins: [
                        // "syntax-dynamic-import",
                        // 'transform-es3-property-literals',
                        // 'transform-es3-member-expression-literals',
                        // [
                        //     "import", {
                        //         "libraryName": "antd",
                        //         "libraryDirectory": "es",
                        //         "style": "css" // `style: true` 会加载 less 文件
                        //     }
                        // ],
                    ]
                },
            },
            { //字体
                test: /\.(eot|svg|ttf|woff|woff2)\w*/,
                // loader: 'file-loader?publicPath=/static/res/&outputPath=font/'
                loader: 'file-loader',
                options: {
                    context: __dirname,
                    outputPath: "static/",
                    publicPath: "static/",
                },
            },
            { //图片
                test: [/\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: 'url-loader',
                options: {
                    limit: 10000, //1w字节以下大小的图片会自动转成base64
                    //用户url-loader超过limit，使用fileloader的情况
                    context: __dirname,
                    outputPath: "static/",
                    publicPath: "static/",
                },
            },
            { //common css
                test: /\.css/,
                include: [
                    path.resolve(__dirname, 'src/common_css'),
                    // /node_modules|antd\.css/
                ],
                loader: 'style-loader!css-loader',
                // loader: 'style-loader!css-loader?modules',
                // use: ExtractTextWebpackPlugin.extract({
                //     fallback: "style-loader",
                //     use: "css-loader"
                // })
            },
            { //css
                test: /\.css/,
                exclude: [
                    path.resolve(__dirname, 'src/common_css'),
                    // /node_modules|antd\.css/
                ],
                loader: 'style-loader!css-loader?modules',
                // loader: 'style-loader!css-loader',
                // use: ExtractTextWebpackPlugin.extract({
                //     fallback: "style-loader",
                //     use: "css-loader"
                // })
            },
        ]
    },
    plugins: [
        //index.html文件的生成
        new HtmlWebpackPlugin({
            template: './public/index.html', //指定模板路径
            filename: 'index.html', //指定文件名
        }),
        //拷贝静态资源
        new CopyWebpackPlugin([{
            from: './public/static',
            to: "static/",
            force: true
        }]),
        // new SWPrecacheWebpackPlugin({
        //       cacheId: 'education-web-mobile',
        //       filename: 'static/service-worker.js',
        //       verbose: true,
        //       staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
        // }),
        // new BundleAnalyzerPlugin(),
        // new ExtractTextWebpackPlugin("bundle.css"),
    ],
    // optimization: {
    //     runtimeChunk: 'single',
    //     splitChunks: {
    //         chunks: 'all',
    //         cacheGroups: {
    //             // vendors: {
    //             //     test: /[\\/]node_modules[\\/]/,
    //             //     name: 'vendors',
    //             //     chunks: 'all'
    //             // },
    //             react: {
    //                 test: /react/,
    //                 name: 'react',
    //                 chunks: 'all',
    //                 minChunks: 1,
    //                 priority: 2, 
    //             },
    //             katex_fontawesome_izitoast: {
    //                 test: /src\/common_css\/(katex|font_awesome|iziToast)/,
    //                 name: 'katex_fontawesome_izitoast',
    //                 chunks: "all",
    //                 minChunks: 1,
    //                 priority: 2, 
    //             },
    //             editormd: {
    //                 test: /src\/common_css\/editormd/,
    //                 name: 'editormd',
    //                 chunks: "all",
    //                 minChunks: 1,
    //                 priority: 2,
    //             },
    //         }
    //     }
    // },
    // devServer: {
    //     contentBase: require('path').join(__dirname, "build"),
    //     compress: true,
    //     port: 8033,
    //     host: "127.0.0.1",
    // },
}