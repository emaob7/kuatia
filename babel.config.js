module.exports = (api) => {
  api.cache(true);
  return {
    // biome-ignore lint/suspicious/noDuplicateObjectKeys: <explanation>
    presets: ['babel-preset-expo'],
    presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin'],
  };
};
