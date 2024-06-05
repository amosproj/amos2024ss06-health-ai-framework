const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  stream: require.resolve('readable-stream')
};

module.exports = config;
