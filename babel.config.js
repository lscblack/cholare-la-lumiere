module.exports = function (api) {
  api.cache(true);
  return {
    "presets": [
      "module:metro-react-native-babel-preset"
    ],
    "plugins": [
      ["@babel/plugin-transform-runtime"],
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      ["@babel/plugin-proposal-class-properties", { "loose": false }],
      ["@babel/plugin-transform-flow-strip-types"],
      ["@babel/plugin-transform-react-jsx"],
      ["@babel/plugin-transform-arrow-functions"]
    ]
  }
  ;
};
