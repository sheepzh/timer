import path from "path"
import GenerateJsonPlugin from "generate-json-webpack-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"
import webpack, { Chunk, DefinePlugin } from "webpack"
import i18nChrome from "../src/i18n/chrome"
import tsConfig from '../tsconfig.json'
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import { POLYFILL_SCRIPT_NAME } from "../src/content-script/polyfill/inject"

export const MANIFEST_JSON_NAME = "manifest.json"

const tsPathAlias = tsConfig.compilerOptions.paths

const generateJsonPlugins = []

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
    name: POLYFILL_SCRIPT_NAME,
    path: './src/content-script/polyfill',
    chunkExclusive: true,
}, {
    name: 'popup',
    path: './src/popup',
}, {
    name: 'app',
    path: './src/app',
}, {
    name: 'side',
    path: './src/side'
}]

const EXCLUDE_CHUNK_ENTRY = entryConfigs.filter(({ chunkExclusive }) => chunkExclusive).map(({ name }) => name)

const excludeChunk = (chunk: Chunk) => !EXCLUDE_CHUNK_ENTRY.includes(chunk.name)

const staticOptions: webpack.Configuration = {
    entry() {
        const entry = {}
        entryConfigs.forEach(({ name, path }) => entry[name] = path)
        return entry
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /^(node_modules|test|script)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        assumptions: {
                            // Fix that react transform array proxy to object, and error occurs while destructing
                            iterableIsArray: true,
                        },
                        presets: ["@babel/preset-env"],
                        plugins: [
                            "@vue/babel-plugin-jsx",
                            "@babel/plugin-transform-modules-commonjs",
                        ],
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
                //////// libraries start ////////
                echarts: {
                    name: 'echarts',
                    chunks: excludeChunk,
                    filename: 'bundle/echarts.js',
                    test: /[\\/]node_modules[\\/](echarts|zrender)[\\/]/,
                },
                // @vue & vue-router
                vue: {
                    name: 'vue',
                    chunks: excludeChunk,
                    filename: 'bundle/vue.js',
                    test: /[\\/]node_modules[\\/]@?vue(use)?(-router)?[\\/]/,
                },
                element: {
                    name: 'element',
                    chunks: excludeChunk,
                    filename: 'bundle/element.js',
                    test: /[\\/]node_modules[\\/]@?element-plus[\\/]/,
                },
                lodash: {
                    name: 'lodash',
                    chunks: excludeChunk,
                    filename: 'bundle/lodash.js',
                    test: /[\\/]node_modules[\\/]lodash[\\/]/,
                },
                //////// libraries end ////////
                //////// common start ////////
                api: {
                    name: 'api',
                    chunks: excludeChunk,
                    filename: 'common/api.js',
                    test: /[\\/]src[\\/]api[\\/]/,
                },
                common: {
                    name: 'common',
                    chunks: excludeChunk,
                    test: /[\\/]src[\\/](service|database|util)[\\/]/,
                },
                //////// common end ////////
            }
        },
    },
}

type Option = {
    outputPath: string
    manifest: chrome.runtime.ManifestV3 | chrome.runtime.ManifestFirefox
    mode: webpack.Configuration["mode"]
}

const generateOption = ({ outputPath, manifest, mode }: Option) => {
    const plugins = [
        ...generateJsonPlugins,
        new GenerateJsonPlugin(MANIFEST_JSON_NAME, manifest) as unknown as webpack.WebpackPluginInstance,
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
            meta: {
                viewport: {
                    name: "viewport",
                    content: 'width=device-width',
                },
            },
            chunks: ['app'],
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '..', 'public', 'popup.html'),
            filename: path.join('static', 'popup.html'),
            chunks: ['popup'],
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '..', 'public', 'side.html'),
            filename: path.join('static', 'side.html'),
            chunks: ['side'],
        }),
        new DefinePlugin({
            // https://github.com/vuejs/vue-cli/pull/7443
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
            __VUE_OPTIONS_API__: false,
            __VUE_PROD_DEVTOOLS__: false,
        }),
    ]
    const config: webpack.Configuration = {
        ...staticOptions,
        output: {
            path: outputPath,
            filename: '[name].js',
        },
        plugins, mode,
    }
    if (mode === "development") {
        // no eval with development, but generate *.map.js
        config.devtool = 'cheap-module-source-map'
        // Use cache with filesystem
        config.cache = { type: 'filesystem' }
    }
    return config
}

export default generateOption