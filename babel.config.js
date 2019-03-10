module.exports = function (api) {
  api.cache(true);

  const presets = [
    ["@babel/preset-env", {
      "useBuiltIns": "entry"
    }]
  ];
  const plugins = [];

  return {
    presets,
    plugins
  };
}