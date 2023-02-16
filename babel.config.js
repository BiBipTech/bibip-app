module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      "nativewind/babel",
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blacklist: null,
          whitelist: ["TRIP_API", "WALLET_API", "PBM_API"],
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
