// const { getDefaultConfig } = require("expo/metro-config");

module.exports = function (api) {
  api.cache(true);
  if (process.env.NODE_ENV === "production")
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
        "transform-remove-console",
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
