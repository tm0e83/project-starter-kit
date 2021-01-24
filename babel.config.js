module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        "targets": {
          "ie": "11"
        }
      }
    ]
  ];

  const plugins = ['@babel/plugin-syntax-dynamic-import'];

  return {
    presets,
    plugins
  };
}