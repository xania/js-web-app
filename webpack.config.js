const fspath = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isDevelopment = !argv.mode || argv.mode === "development";
  const config = buildConfig(isDevelopment);
  if (isDevelopment) {
    console.log("development: " + isDevelopment);
    return {
      ...config,
      mode: "development",
      devtool: "inline-source-map",
    };
  }
  return config;
};

function buildConfig(isDevelopment) {
  return {
    target: "web",
    entry: isDevelopment
      ? ["./src/index.ts", "./src/watcher.ts"]
      : ["./src/index.ts"],
    mode: isDevelopment ? "development" : "production",
    devServer: {
      contentBase: "./dist",
      historyApiFallback: true,
      open: false,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                esModule: true,
                name: "[path][name]-[hash].css",
              },
            },
            { loader: "extract-loader" },
            // { loader: "style-loader" },
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                // you can specify a publicPath here
                // by default it uses publicPath in webpackOptions.output
                publicPath: "./",
                // esModule: true,
                // hmr: true,
              },
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: isDevelopment,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [["autoprefixer"]],
                },
              },
            },
            {
              loader: "sass-loader",
              options: {
                // Prefer Dart Sass
                implementation: require("sass"),
                sassOptions: {
                  includePaths: ["./node_modules"],
                },
              },
            },
          ],
        },
        {
          test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
          use: {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]",
            },
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".scss", ".css"],
    },
    output: {
      filename: "[name]-[chunkhash:8].js",
      path: fspath.resolve(__dirname, "dist"),
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        name: false,
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // all options are optional
        filename: "[name].[chunkhash:8].css",
        chunkFilename: "[id].css",
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),
      new HtmlWebpackPlugin({
        template: fspath.resolve(__dirname, "./index.html"),
        inject: true,
      }),
    ],
  };
}
