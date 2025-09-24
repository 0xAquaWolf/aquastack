// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */

const config = getDefaultConfig(__dirname);

// Exclude web app's node_modules to prevent conflicts
config.resolver.blockList = [
  /apps\/web\/node_modules\/.*/,
  /packages\/ui\/node_modules\/.*/,
  /@types\/node/,
];

config.watchFolders = [path.resolve(__dirname, '../../')];

module.exports = withNativeWind(config, { input: './global.css' });
