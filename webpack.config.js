const path = require("path");
const autoprefixer = require("autoprefixer");

module.exports = (env, argv) => {
    const config = productionConfig();
    console.log(argv);
    if (!argv.mode || argv.mode === "development") {
        return {
            ...config,
            mode: "development",
            devtool: "inline-source-map",
        };
    }
    return config;
};

function productionConfig() {
    return {
        target: "web",
        entry: ["./src/index.ts", "./src/app/style.scss"],
        mode: "production",
        devServer: {
            // contentBase: "./src",
            historyApiFallback: true,
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
                                name: "bundle.css",
                            },
                        },
                        { loader: "extract-loader" },
                        { loader: "css-loader" },
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: () => [autoprefixer()],
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
            ],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
        },
        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, "dist"),
        },
    };
}
