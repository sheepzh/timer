import path from "path"
import GenerateJsonPlugin from "generate-json-webpack-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"
import webpack, { Chunk } from "webpack"
// Generate json files
import manifest from "../src/manifest"
import i18nChrome from "../src/i18n/chrome"
import tsConfig from '../tsconfig.json'
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"

const tsPathAlias = tsConfig.compilerOptions.paths

const generateJsonPlugins = [
    new GenerateJsonPlugin('manifest.json', manifest) as unknown as webpack.WebpackPluginInstance
]

const localeJsonFiles = Object.entries(i18nChrome)
    .map(([locale, message]) => new GenerateJsonPlugin(`_locales/${locale}/messages.json`, message))
    .map(plugin => plugin as unknown as webpack.WebpackPluginInstance)
generateJsonPlugins.push(...localeJsonFiles)

// Process the alias of typescript modules
const resolveAlias: { [index: string]: string | false | string[] } = {}
const aliasPattern = /^(@.*)\/\*$/
const sourcePattern = /^(src(\/.*)?)\/\*$/
Object.entries(tsPathAlias).forEach(([alias, sourceArr]) => {
    // Only process the alias starts with '@'
    if (!aliasPattern.test(alias)) {
        return
    }
    if (!sourceArr.length) {
        return
    }
    const index = alias.match(aliasPattern)[1]
    const webpackSourceArr = sourceArr
        .filter(source => sourcePattern.test(source))
        // Only set alias which is in /src folder
        .map(source => source.match(sourcePattern)[1])
        .map(folder => path.resolve(__dirname, '..', folder))
    resolveAlias[index] = webpackSourceArr
})
console.log("Alias of typescript: ")
console.log(resolveAlias)

type EntryConfig = {
    name: string
    path: string
    chunkExclusive?: boolean
}

const entryConfigs: EntryConfig[] = [{
    name: 'background',
    path: './src/background',
    chunkExclusive: true,
}, {
    name: 'content_scripts',
    path: './src/content-script',
    chunkExclusive: true,
}, {
    name: 'popup',
    path: './src/popup',
}, {
    name: 'app',
    path: './src/app',
}, {
    name: 'guide',
    path: './src/guide',
}]

const EXCLUDE_CHUNK_ENTRY = entryConfigs.filter(({ chunkExclusive }) => chunkExclusive).map(({ name }) => name)

const excludeChunk = (chunk: Chunk) => !EXCLUDE_CHUNK_ENTRY.includes(chunk.name)

const staticOptions: webpack.Configuration = {
    entry() {
        const entry = {}
        entryConfigs.forEach(({ name, path }) => entry[name] = path)
        return entry
    },
    output: {
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /^(node_modules|test|script)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ["@vue/babel-plugin-jsx", "@babel/plugin-transform-modules-commonjs"],
                    },
                }, 'ts-loader'],
            }, {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            }, {
                test: /\.sc|ass$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
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
        extensions: ['.ts', '.tsx', ".js", '.css', '.scss', '.sass'],
        alias: resolveAlias,
        fallback: {
            // fallbacks of axios's dependencies start
            stream: require.resolve('stream-browserify'),
            zlib: false,
            https: false,
            http: false,
            url: false,
            assert: false,
            // fallbacks of axios's dependencies end
        }
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                echarts: {
                    name: 'echarts',
                    chunks: excludeChunk,
                    test: /[\\/]node_modules[\\/](echarts|zrender)[\\/]/,
                },
                // @vue & vue-router
                vue: {
                    name: 'vue',
                    chunks: excludeChunk,
                    test: /[\\/]node_modules[\\/]@?vue(use)?(-router)?[\\/]/,
                },
                element: {
                    name: 'element',
                    chunks: excludeChunk,
                    test: /[\\/]node_modules[\\/]@?element-plus[\\/]/,
                },
                psl: {
                    name: 'psl',
                    chunks: excludeChunk,
                    test: /[\\/]node_modules[\\/]psl[\\/]/,
                },
                lodash: {
                    name: 'lodash',
                    chunks: excludeChunk,
                    test: /[\\/]node_modules[\\/]lodash[\\/]/,
                },
                axios: {
                    name: 'axios',
                    chunks: excludeChunk,
                    test: /[\\/]node_modules[\\/]axios[\\/]/,
                },
                common: {
                    name: 'common',
                    chunks: excludeChunk,
                    test: /[\\/]src[\\/](service|database|util)[\\/]/,
                },
            }
        },
    },
}

const optionGenerator = (outputPath: string, manifestHooker?: (manifest: chrome.runtime.ManifestV3) => void) => {
    manifestHooker?.(manifest)
    const plugins = [
        ...generateJsonPlugins,
        // copy static resources
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(__dirname, '..', 'public', 'images'),
                    to: path.join(outputPath, 'static', 'images'),
                }
            ]
        }),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '..', 'public', 'app.html'),
            filename: path.join('static', 'app.html'),
            chunks: ['app'],
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '..', 'public', 'guide.html'),
            filename: path.join('static', 'guide.html'),
            chunks: ['guide'],
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '..', 'public', 'popup.html'),
            filename: path.join('static', 'popup.html'),
            chunks: ['popup'],
        }),
    ]
    return {
        ...staticOptions,
        plugins
    } as webpack.Configuration
}

export default optionGenerator