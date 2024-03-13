const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  optimization: {
    minimize: false, // не получается настроить extract css
    minimizer: [new CssMinimizerPlugin()],
  },
});
