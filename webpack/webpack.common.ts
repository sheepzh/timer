import CopyWebpackPlugin from "copy-webpack-plugin"
import GenerateJsonPlugin from "generate-json-webpack-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import path from "path"
import postcssRTLCSS from 'postcss-rtlcss'
import webpack, { Chunk, DefinePlugin, RuleSetRule } from "webpack"
import { POLYFILL_SCRIPT_NAME } from "../src/content-script/polyfill/inject"
import i18nChrome from "../src/i18n/chrome"
import tsConfig from '../tsconfig.json'

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
}

const BACKGROUND = 'background'
const CONTENT_SCRIPT = 'content_scripts'
const POPUP = 'popup'

const entryConfigs: EntryConfig[] = [{
    name: BACKGROUND,
    path: './src/background',
}, {
    name: CONTENT_SCRIPT,
    path: './src/content-script',
}, {
    name: POLYFILL_SCRIPT_NAME,
    path: './src/content-script/polyfill',
}, {
    name: POPUP,
    path: './src/popup',
}, {
    name: 'app',
    path: './src/app',
}, {
    name: 'side',
    path: './src/side'
}]

const POSTCSS_LOADER_CONF: RuleSetRule['use'] = {
    loader: 'postcss-loader',
    options: {
        postcssOptions: {
            plugins: [postcssRTLCSS({ mode: 'combined' })],
        },
    },
}

const chunkFilter = ({ name }: Chunk) => {
    return ![BACKGROUND, CONTENT_SCRIPT, POLYFILL_SCRIPT_NAME].includes(name)
}

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
                use: [MiniCssExtractPlugin.loader, 'css-loader', POSTCSS_LOADER_CONF],
            }, {
                test: /\.sc|ass$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', POSTCSS_LOADER_CONF, 'sass-loader']
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
            chunks: chunkFilter,
            cacheGroups: {
                defaultVendors: {
                    filename: 'vendor/[name].js'
                }
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
            filename: path.join('static', 'app.html'),
            title: 'Loading...',
            meta: {
                viewport: {
                    name: "viewport",
                    content: 'width=device-width',
                },
            },
            chunks: ['app'],
        }),
        new HtmlWebpackPlugin({
            filename: path.join('static', 'popup.html'),
            chunks: ['popup'],
        }),
        new HtmlWebpackPlugin({
            filename: path.join('static', 'side.html'),
            title: 'Loading...',
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