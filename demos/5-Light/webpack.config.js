const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./index.ts",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(mtl|png|jpg|obj|tga)$/,
                use: "file-loader",
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            filename: "index.html",
        }),
    ],
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    devServer: {
        static: false,
        compress: true,
        port: 9000,
    },
};
