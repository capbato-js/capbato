const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = (config, { options = {}, context = {} } = {}) => {
  const isProduction = options.mode === 'production' || process.env['NODE_ENV'] === 'production';
  
  return {
    output: {
      path: join(__dirname, '../../dist/apps/api'),
    },
    // Add development-specific optimizations
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'eval-source-map',
    cache: isProduction ? false : {
      type: 'filesystem',
      cacheDirectory: join(__dirname, '../../node_modules/.cache/webpack'),
    },
    plugins: [
      new NxAppWebpackPlugin({
        target: 'node',
        compiler: isProduction ? 'tsc' : 'swc', // Use SWC in development for speed
        main: './src/main.ts',
        tsConfig: './tsconfig.app.json',
        assets: ['./src/assets'],
        optimization: isProduction,
        outputHashing: isProduction ? 'all' : 'none',
        generatePackageJson: true,
        // Development optimizations
        ...(isProduction ? {} : {
          extractLicenses: false,
          namedChunks: true,
        }),
      }),
    ],
    resolve: {
      // Add caching for module resolution
      cache: !isProduction,
    },
    // Development-specific settings
    ...(!isProduction && {
      stats: 'minimal',
      infrastructureLogging: {
        level: 'warn',
      },
    }),
  };
};
