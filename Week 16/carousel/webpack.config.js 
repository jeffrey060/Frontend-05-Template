module.exports = {
  entry: "./main.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                { pragma: "createElement" },
              ],
            ],
          },
        },
      },
    ],
  },
  // 开发者模式： dist 文件可调试
  mode: "development",
  // devServer: {
  //   open: true,
  //   hot: true,
  //   compress: true,
  //   disableHostCheck: true, //webpack4.0 开启热更新
  // },
};
