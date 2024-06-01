module.exports = (api) => {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      prod: {
        plugins: ['react-native-paper/babel']
      }
    }
  };
};
