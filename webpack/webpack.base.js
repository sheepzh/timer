const path = require('path')
const GenerateJsonPlugin = require('generate-json-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader-plugin')

// Generate json files 
const manifest = require('../src/manifest')
const generateJsonPlugins = [new GenerateJsonPlugin('manifest.json', manifest)]
// Resolve the locale json files
const { chromeMessages } = require('../src/locale/index')


for (const localeName in chromeMessages) {
    const locale = chromeMessages[localeName]
    generateJsonPlugins.push(new GenerateJsonPlugin(path.join("_locales", localeName, "messages.json"), locale))
}

const optionGenerator = (outputPath, manifestHooker) => {
    manifestHooker && manifestHooker(manifest)
    const plugins = [
        new VueLoaderPlugin(),
        ...generateJsonPlugins,
        // copy static resources
        new CopyWebpackPlugin({
            patterns: [
                { from: path.join(__dirname, '..', 'public'), to: path.join(outputPath, 'static') }
            ]
        })
    ]
    return {
        entry: {
            background: './src/background.ts',
            content_scripts: './src/content-script.ts',
            popup: './src/popup/main.js',
            app: './src/app/main.js'
        },
        output: {
            filename: '[name].js',
        },
        plugins,
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: '/node_modules/',
                    use: ['ts-loader', {
                        loader: 'ui-component-loader',
                        options: {
                            'element-ui': {
                                'camel2': '-'
                            }
                        }
                    }]
                }, {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                }, {
                    test: /\.scss$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                }, {
                    test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
                    // exclude: /node_modules/,
                    use: ['url-loader?limit=100000']
                }, {
                    test: /\.vue$/,
                    exclude: /node_modules/,
                    use: ['vue-loader']
                }, {
                    test: /\.m?js$/,
                    exclude: /(node_modules)/,
                    use:
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                [
                                    'component', {
                                        "libraryName": "element-ui",
                                        "styleLibraryName": "theme-chalk"
                                    },
                                    "element-ui"
                                ]
                            ]
                        }
                    }
                }
            ]
        },
        resolve: {
            extensions: [".tsx", '.ts', ".js", '.vue', 'css'],
        }
    }
}


module.exports = optionGenerator