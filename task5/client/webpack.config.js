const path = require('path'); 
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
   entry: './src/main.ts',
   output: {
      filename: 'bundle.[hash].js',
      path: path.resolve(__dirname, 'build'),
   },
   plugins: [
      new HtmlWebpackPlugin({
         template: 'index.html',
      }),
      new Dotenv(),
      new webpack.ProvidePlugin({
         process: 'process/browser',
  }),
   ],
   resolve: {
      modules: [__dirname, 'src', 'node_modules'],
      extensions: ['.', '.js', '.ts'],
      fallback: {
         "fs": false,
         "url": false,
         "buffer": false,
         "path": false,
         "stream": false,
         "process": false
       } 
   },
   module: {
      rules: [
         {
            test: /\.ts$/i,
            loader: 'ts-loader',
            exclude: ['/node_modules/']
         },
         {
            test: /\.(scss|css)$/i,
            use: ['style-loader', 'css-loader', 'sass-loader'],
         },
      ],
   },
   devServer: {
      static: {
         directory: path.join(__dirname, 'dist'),
      },
      open: true,
   },
};
