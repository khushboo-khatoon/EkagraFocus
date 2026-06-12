const path = require('path');
const webpack = require('webpack');

function buildPreload() {
  return new Promise((resolve, reject) => {
    const preloadConfig = require('./webpack.preload.config.js');
    webpack(preloadConfig, (err, stats) => {
      if (err) { reject(err); return; }
      if (stats.hasErrors()) {
        console.error(stats.toString());
        reject(new Error('Preload build failed'));
        return;
      }
      console.log('[Preload] ✓ Built to .webpack/main/preload.js');
      resolve();
    });
  });
}

module.exports = {
  packagerConfig: { asar: true },
  rebuildConfig: {},
  makers: [
    { name: '@electron-forge/maker-squirrel', config: {} },
    { name: '@electron-forge/maker-zip', platforms: ['darwin'] },
    { name: '@electron-forge/maker-deb' },
    { name: '@electron-forge/maker-rpm' },
  ],
  hooks: {
    generateAssets: async () => {
      await buildPreload();
    },
  },
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        devContentSecurityPolicy: `default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:`,
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/main.tsx',
              name: 'main_window',
            },
          ],
        },
      },
    },
  ],
};