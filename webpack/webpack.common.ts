import path from "path"
import GenerateJsonPlugin from "generate-json-webpack-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"
import webpack from "webpack"
// Generate json files 
import manifest from "../src/manifest"
import i18nChrome from "../src/util/i18n/chrome"

const generateJsonPlugins = [
    new GenerateJsonPlugin('manifest.json', manifest) as unknown as webpack.WebpackPluginInstance
]

const localeJsonFiles = Object.entries(i18nChrome)
    .map(([locale, message]) => new GenerateJsonPlugin(`_locales/${locale}/messages.json`, message))
    .map(plugin => plugin as unknown as webpack.WebpackPluginInstance)
generateJsonPlugins.push(...localeJsonFiles)

const staticOptions: webpack.Configuration = {
    entry: {
        background: './src/background',
        content_scripts: './src/content-script',
        // The entrance of popup page
        popup: './src/popup',
        // The entrance of app page
        app: './src/app'
    },
    output: {
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /^(node_modules|test)/,
                use: ['ts-loader']
            }, {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            }, {
                test: /\.sc|ass$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }, {
                test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
                exclude: /node_modules/,
                use: ['url-loader']
            }, {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.ts', ".js", '.css', '.scss', '.sass'],
        alias: {
            // The alias of path
            // @see $root_path/tsconfig.json
            '@src': path.resolve(__dirname, '..', 'src'),
            '@db': path.resolve(__dirname, '..', 'src', 'database'),
            '@service': path.resolve(__dirname, '..', 'src', 'service'),
            "@entity": path.resolve(__dirname, '..', 'src', 'entity'),
            "@util": path.resolve(__dirname, '..', 'src', 'util'),
            "@app": path.resolve(__dirname, '..', 'src', 'app'),
        }
    }
}

const optionGenerator = (outputPath: string, manifestHooker?: (manifest: chrome.runtime.ManifestV2) => void) => {
    manifestHooker?.(manifest)
    const plugins = [
        ...generateJsonPlugins,
        // copy static resources
        new CopyWebpackPlugin({
            patterns: [
                { from: path.join(__dirname, '..', 'public'), to: path.join(outputPath, 'static') }
            ]
        })
    ]
    return {
        ...staticOptions,
        plugins
    } as webpack.Configuration
}

export default optionGenerator