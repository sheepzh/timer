const path = require('path')
const GenerateJsonPlugin = require('generate-json-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

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
        plugins,
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: '/node_modules/',
                    use: ['ts-loader']
                }, {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                }, {
                    test: /\.sc|ass$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                }, {
                    test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
                    // exclude: /node_modules/,
                    use: ['url-loader?limit=100000']
                }, {
                    test: /\.m?js$/,
                    exclude: /(node_modules)/,
                    use: ['babel-loader']
                }
            ]
        },
        resolve: {
            extensions: ['.ts', ".js", '.css', '.scss', '.sass'],
        }
    }
}


module.exports = optionGenerator