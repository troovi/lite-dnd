import HtmlWebpackPlugin from 'html-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import fs from 'fs-extra'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

const paths = {
  appBuild: 'build',
  appPublic: 'public',
  appHtml: 'public/index.html',
  entry: 'src/index'
}

export default ({ mode }) => {
  const isEnvDevelopment = mode === 'development'
  const isEnvProduction = mode === 'production'

  if (isEnvDevelopment) {
    dotenv.config({ path: path.resolve(process.cwd(), '../.env') })
  }

  if (isEnvProduction) {
    fs.emptyDirSync(paths.appBuild)
    fs.copySync(paths.appPublic, paths.appBuild, {
      dereference: true,
      filter: (file) => file !== paths.appHtml
    })
  }

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  return {
    context: __dirname,
    mode: mode,
    entry: paths.entry,
    output: {
      path: path.resolve(__dirname, paths.appBuild),
      pathinfo: false,
      filename: 'static/js/[name].[contenthash:8].js',
      chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
      publicPath: isEnvProduction ? './' : '/',
      assetModuleFilename: 'static/media/[name].[hash][ext]'
    },
    devServer: {
      hot: true,
      port: process.env.PORT,
      host: process.env.HOST,
      open: true,
      historyApiFallback: true,
      client: {
        overlay: {
          errors: true,
          warnings: false
        }
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml
      }),
      new ESLintPlugin({
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
        cache: false
      }),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
        }),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          context: __dirname,
          diagnosticOptions: {
            syntactic: true
          },
          mode: 'write-references'
        }
      })
    ].filter(Boolean),
    optimization: {
      minimize: isEnvProduction,
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()]
    },
    resolve: {
      modules: [__dirname, 'src', 'node_modules'],
      extensions: ['*', '.js', '.jsx', '.tsx', '.ts', '.scss']
    },
    module: {
      rules: [
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource'
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          type: 'asset'
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack']
        },
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-env',
              '@babel/preset-typescript'
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              ['@babel/plugin-proposal-decorators', { legacy: true }]
            ].filter(Boolean),
            babelrc: false,
            configFile: false
          }
        },
        {
          test: /\.css$/i,
          use: [
            isEnvDevelopment && {
              loader: 'style-loader'
            },
            isEnvProduction && {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  mode: 'local',
                  /* eslint-disable-next-line */
                  auto: /\module\.\w+$/i,
                  localIdentName: '[local]--[hash:base64:5]'
                }
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  ident: 'postcss',
                  config: false,
                  plugins: ['tailwindcss', 'autoprefixer']
                }
              }
            }
          ].filter(Boolean)
        }
      ]
    }
  }
}
