const TerserPlugin = require("terser-webpack-plugin");
const chalk = require('chalk')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const path = require("path")

module.exports = {
 mode: "production",
 entry: {
  index: path.resolve(__dirname, './package/index.js'),
},
 output: {
  filename: '[name].[fullhash].js',
  path: path.resolve(__dirname, './dist'),
 },
 module: {
  rules: [
   {
    test: /\.m?js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
     loader: 'babel-loader',
     options: {
      presets: ['@babel/preset-env'],
      plugins:[ // 设置编译的插件
      ['@babel/plugin-transform-runtime'] //设置编译的规则
    ]
     }
    }
   },
  ],
 },
//  resolveLoader: {
//   modules: ['node_modules'],
//   extensions: ['.js', '.json'],
//   mainFields: ['loader', 'main'],
// },
 optimization: {
  minimize: true,
  minimizer: [new TerserPlugin({
    include: /\/package/,
   test: /\.js(\?.*)?$/i,
   // minify: TerserPlugin.uglifyJsMinify,
   // // `terserOptions` options will be passed to `uglify-js`
   // // Link to options - https://github.com/mishoo/UglifyJS#minify-options
   // terserOptions: {},
  })],
 },
 // plugins: [
 //  new ProgressBarPlugin({
 //   format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`
 //  }),
 //  // 打包体积分析
 // ],
}

