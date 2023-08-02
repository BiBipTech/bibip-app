// const { getDefaultConfig } = require("expo/metro-config");

module.exports = function (api) {
  // const defaultConfig = getDefaultConfig(__dirname);

  // const { transformer, resolver } = defaultConfig;

  // defaultConfig.transformer = {
  //   ...transformer,
  //   babelTransformerPath: require.resolve("react-native-svg-transformer"),
  // };
  // defaultConfig.presets = ["babel-preset-expo"];
  // defaultConfig.plugins = [
  //   "react-native-reanimated/plugin",
  //   "nativewind/babel",
  //   [
  //     "module:react-native-dotenv",
  //     {
  //       moduleName: "@env",
  //       path: ".env",
  //       blacklist: null,
  //       whitelist: ["TRIP_API", "WALLET_API", "PBM_API"],
  //       safe: false,
  //       allowUndefined: true,
  //     },
  //   ],
  // ];
  // config.resolver = {
  //   ...resolver,
  //   assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  //   sourceExts: [...resolver.sourceExts, "svg"],
  // };
  api.cache(true);
  return {
    presets: [
      [
        "module:metro-react-native-babel-preset",
        {
          unstable_disableES6Transforms: true,
        },
      ],
      "babel-preset-expo",
    ],
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
