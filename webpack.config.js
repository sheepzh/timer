const path = require('path')
const { name, version } = require('./package.json')
const GenerateJsonPlugin = require('generate-json-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader-plugin')
const FileManagerWebpackPlugin = require('filemanager-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')
const { env, variables, analyze } = require('./env')(__dirname)
const isDev = env === 'development'
const isProd = env === 'production'

// Generate json files 
const manifest = require('./src/manifest')
isDev && (manifest.name = "IS DEV")
const generateJsonPlugins = [new GenerateJsonPlugin('manifest.json', manifest)]
// Resolve the locale json files
const { chromeMessages } = require('./src/locale/index')
for (const localeName in chromeMessages) {
  const locale = chromeMessages[localeName]
  generateJsonPlugins.push(new GenerateJsonPlugin(path.join("_locales", localeName, "messages.json"), locale))
}
const manifestFirefoxName = 'manifest-firefox.json'
if (isDev) {
  // The manifest.json is different from Chrome's with add-on ID
  const firefoxManifestGeneratePlugin = new GenerateJsonPlugin(manifestFirefoxName, { ...manifest, browser_specific_settings: { gecko: { id: 'timer@zhy' } } })
  generateJsonPlugins.push(firefoxManifestGeneratePlugin)
}

const plugins = [
  new VueLoaderPlugin(),
  ...generateJsonPlugins,
  new CopyWebpackPlugin({ patterns: [{ from: __dirname + '/public', to: './static' }] }), // copy static resources
  // Define environment variables
  new webpack.DefinePlugin({
    'process.env': {
      ENV: env,
      ...variables
    }
  })
]

analyze && plugins.push(new BundleAnalyzerPlugin())

if (isProd) {
  const normalZipFilePath = `./market_packages/${name}-${version}.zip`
  const sourceCodeForFireFox = `./market_packages/${name}-${version}-src.zip`

  const srcDir = ['public', 'src', 'env.js', 'package.json', 'tsconfig.json', 'webpack.config.js']
  const copyMapper = srcDir.map(path => { return { source: `./${path}`, destination: `./firefox/${path}` } })

  // Delete license files
  const onEnd = [{ delete: ['./dist_prod/*.LICENSE.txt'] }]
  if (!analyze) {
    // Not analyze, really production
    onEnd.push(
      // Define plugin to archive zip for differrent markets
      {
        delete: [normalZipFilePath],
        archive: [{ source: './dist_prod', destination: normalZipFilePath }]
      })
    onEnd.push(
      // Archive srouce code for FireFox
      {
        copy: [
          { source: './doc/for-fire-fox.md', destination: './firefox/README.md' },
          { source: './doc/for-fire-fox.md', destination: './firefox/doc/for-fire-fox.md' },
          ...copyMapper
        ],
        archive: [
          { source: './firefox', destination: sourceCodeForFireFox },
        ],
        delete: ['./firefox']
      }
    )
  }

  plugins.push(
    new FileManagerWebpackPlugin({
      events: {
        onStart: [{ delete: ['./dist_prod/*'] }],
        // Archive at the end
        onEnd
      }
    })
  )
} else if (isDev) {
  const firefoxDevDir = './firefox_dev'
  // Generate FireFox dev files
  plugins.push(new FileManagerWebpackPlugin({
    events: {
      onStart: [{ delete: [firefoxDevDir + '/*', './dist_dev/*'] }],
      onEnd: [
        {
          copy: [{ source: './dist_dev/*', destination: firefoxDevDir }],
          delete: [`./dist_dev/${manifestFirefoxName}`, `${firefoxDevDir}/manifest.json`],
          move: [{ source: `${firefoxDevDir}/${manifestFirefoxName}`, destination: `${firefoxDevDir}/manifest.json` }]
        }
      ]
    }
  }))
}

const options = {
  entry: {
    background: './src/background.ts',
    content_scripts: './src/content-script.ts',
    popup: './src/popup/main.js',
    app: './src/app/main.js'
  },
  output: {
    path: path.join(__dirname, { 'production': 'dist_prod', 'development': 'dist_dev' }[env] || 'dist_dev'),
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

if (isDev) {
  // no eval with development, but generate *.map.js
  options.devtool = 'cheap-module-source-map'
}

module.exports = options