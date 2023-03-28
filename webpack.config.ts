import * as path from 'path';
import * as webpack from 'webpack';
import 'webpack-dev-server';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import fs from 'fs';
const {
  docsAddonDevMiddleware,
  docsAddonWebpackPlugin,
} = require('@lark-opdev/block-docs-addon-webpack-utils');

const cwd = process.cwd();
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const injectScripts = `<script>${fs.readFileSync(
  path.resolve(__dirname, './inject-scripts/storage-polyfill.js')
)}</script>`;

const config: webpack.Configuration = {
  entry: {
    index: './src/index.tsx',
    setting: './src/setting.tsx'
  },
  mode: isDevelopment ? 'development' : 'production',
  stats: 'errors-only',
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: isDevelopment ? '/block/' : './'
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.[jt]sx?$/,
            include: [path.join(cwd, 'src')],
            exclude: /node_modules/,
            use: [
              {
                loader: require.resolve('babel-loader'),
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        useBuiltIns: 'entry',
                        targets: {
                          browsers: ['last 2 versions', 'safari >= 10', 'android >= 4.0']
                        },
                        corejs: 2
                      }
                    ],
                    [
                      '@babel/preset-react',
                      {
                        useBuiltIns: true,
                        runtime: 'automatic'
                      }
                    ],
                    '@babel/preset-typescript'
                  ],
                  plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean)
                }
              }
            ]
          },
          {
            test: /\.css$/,
            use: [isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
          },
          {
            test: /\.less$/,
            use: [
              isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'less-loader',
                options: {
                  lessOptions: {
                    modifyVars: {
                      '@theme-css-variable-enabled': 'true'
                    }
                  }
                }
              }
            ]
          },
          {
            test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
            type: 'asset/resource',
            generator: {
              filename: 'assets/[name][ext][query]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    ...(isDevelopment ? [new ReactRefreshWebpackPlugin()] : [new MiniCssExtractPlugin()]),
    new docsAddonWebpackPlugin({}),
    new webpack.ProgressPlugin({
      activeModules: true, // 默认 false，显示活动模块计数和一个活动模块正在进行消息。
      entries: true, // 默认 true，显示正在进行的条目计数消息。
      modules: false, // 默认 true，显示正在进行的模块计数消息。
      modulesCount: 5000, // 默认 5000，开始时的最小模块数。PS:modules启用属性时生效。
      profile: false, // 默认 false，告诉 ProgressPlugin 为进度步骤收集配置文件数据。
      dependencies: false, // 默认 true，显示正在进行的依赖项计数消息。
      dependenciesCount: 10000 // 默认 10000，开始时的最小依赖项计数。PS:dependencies启用属性时生效。
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      publicPath: isDevelopment ? '/block/' : './',
      chunks: ['index'],
      injectScripts
    }),
    new HtmlWebpackPlugin({
      filename: 'setting.html',
      template: './src/setting.html',
      publicPath: isDevelopment ? '/block/' : './',
      chunks: ['setting'],
      injectScripts
    }),
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  optimization: {
    minimize: isProduction,
    minimizer: [new TerserPlugin()],
    moduleIds: 'deterministic',
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all'
        }
      }
    }
  },
  devServer: isProduction
    ? undefined
    : {
        hot: true,
        client: {
          logging: 'error'
        },
        setupMiddlewares: (middlewares, devServer) => {
          if (!devServer || !devServer.app) {
            throw new Error('webpack-dev-server is not defined');
          }
          docsAddonDevMiddleware(devServer).then((middleware: any) => {
            devServer.app?.use(middleware);
          });
          return middlewares;
        },
      },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  }
};

export default config;
