const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const package = require("./package");
const widgetName = package.widgetName;

const widgetConfig = {
    entry: `./src/components/${widgetName}.ts`,
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: `src/com/mendix/widget/custom/${widgetName}/${widgetName}.js`,
        libraryTarget: "umd"
    },
    resolve: {
        extensions: [ ".ts" ],
        alias: {
            "tests": path.resolve(__dirname, "./tests")
        }
    },
    module: {
        rules: [
            { test: /\.ts$/, use: "ts-loader" },
            { test: /\.css$/, loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            }) }
        ]
    },
    devtool: "source-map",
    externals: [ "react", "react-dom", /^mxui\/|^mendix\/|^dojo\/|^dijit\// ],
    plugins: [
        new CopyWebpackPlugin([
            { from: "src/**/*.xml" },
        ], { copyUnmodified: true }),
        new ExtractTextPlugin({ filename: `./src/com/mendix/widget/custom/${widgetName}/ui/${widgetName}.css` }),
        new webpack.LoaderOptionsPlugin({ debug: true })
    ]
};

const previewConfig = {
    entry: `./src/${widgetName}.webmodeler.ts`,
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: `src/${widgetName}.webmodeler.js`,
        libraryTarget: "commonjs"
    },
    resolve: {
        extensions: [ ".ts" ]
    },
    module: {
        rules: [
            { test: /\.ts$/, use: "ts-loader" },
            { test: /\.css$/, use: "css-loader" }
        ]
    },
    devtool: "inline-source-map",
    externals: [ "react", "react-dom", /^mxui\/|^mendix\/|^dojo\/|^dijit\// ],
    plugins: [
        new webpack.LoaderOptionsPlugin({ debug: true })
    ]
};

module.exports = [ widgetConfig, previewConfig ];
