const { defineConfig } = require('@rspack/cli');
const { rspack } = require('@rspack/core');
const { VueLoaderPlugin } = require('vue-loader');
const { resolve } = require('path');
const path = require('path');
const dotenv = require('dotenv');
const pkg = require('./package.json');

dotenv.config();

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'];
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = defineConfig({
  context: __dirname,
  devServer: {
    port: 5173,
    historyApiFallback: true,
    hot: true,
    liveReload: false,
    compress: true,
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: process.env.PUBLIC_PATH_URL || '/',
    clean: !isDevelopment,
    filename: 'assets/js/[name]-[contenthash].js',
    chunkFilename: 'assets/js/[name]-[contenthash].js',
    assetModuleFilename: 'assets/[name]-[hash][ext]',
  },
  entry: {
    main: './src/main.js',
  },
  stats: {
    warnings: false,
  },
  resolve: {
    extensions: ['...', '.js', '.vue'],
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          experimentalInlineMatchResource: true,
        },
      },
      {
        test: /\.(js)$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              env: { targets },
            },
          },
        ],
      },
      {
        test: /\.(scss|sass)$/,
        loader: 'sass-loader',
        type: 'css',
        options: {
          additionalData: `@import '@weni/unnnic-system/src/assets/scss/unnnic.scss';`,
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name]-[hash][ext]',
        },
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html',
      minify: true,
    }),
    new rspack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      'process.env': JSON.stringify(process.env),
      'import.meta.env': JSON.stringify({
        BASE_URL: '/',
      }),
    }),
    new VueLoaderPlugin(),
    new rspack.container.ModuleFederationPlugin({
      name: 'agent_builder',
      filename: 'remoteEntry.js',
      remotes: {
        host: `host@${process.env.MODULE_FEDERATION_CONNECT_URL}/remoteEntry.js`,
      },
      shared: {
        ...pkg,
        vue: {
          singleton: true,
          requiredVersion: pkg.dependencies['vue'],
          eager: true,
        },
        'vue-i18n': {
          singleton: true,
          requiredVersion: pkg.dependencies['vue-i18n'],
          eager: true,
        },
        pinia: {
          singleton: true,
          requiredVersion: pkg.dependencies['pinia'],
          eager: true,
        },
        lodash: {
          singleton: true,
          requiredVersion: pkg.dependencies['lodash'],
          eager: true,
        },
      },
    }),
  ],
  optimization: {
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin(),
      new rspack.LightningCssMinimizerRspackPlugin({
        minimizerOptions: { targets },
      }),
    ],
  },
  experiments: {
    css: true,
  },
});
