const path = require('path')
const GenerateJsonPlugin = require('generate-json-webpack-plugin')
const FileManagerWebpackPlugin = require('filemanager-webpack-plugin')
const optionGenerator = require('./webpack.common')
const webpack = require('webpack')


const outputDir = path.join(__dirname, '..', 'dist_dev')
let manifest

const options = optionGenerator(
  outputDir,
  baseManifest => {
    baseManifest['name'] = 'IS DEV'
    manifest = baseManifest
  }
)

const manifestFirefoxName = 'manifest-firefox.json'
// The manifest.json is different from Chrome's with add-on ID
const firefoxManifestGeneratePlugin = new GenerateJsonPlugin(manifestFirefoxName, { ...manifest, browser_specific_settings: { gecko: { id: 'timer@zhy' } } })
options.plugins.push(firefoxManifestGeneratePlugin)
const firefoxDevDir = path.join(__dirname, '..', 'firefox_dev')
// Generate FireFox dev files
options.plugins.push(
  new FileManagerWebpackPlugin({
    events: {
      onEnd: [
        {
          copy: [{ source: outputDir, destination: firefoxDevDir }],
          delete: [path.join(outputDir, manifestFirefoxName), path.join(firefoxDevDir, 'manifest.json')],
          move: [{ source: path.join(firefoxDevDir, manifestFirefoxName), destination: path.join(firefoxDevDir, 'manifest.json') }]
        }
      ]
    }
  }),
  new webpack.DefinePlugin({
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: false
  })
)

options.output.path = outputDir

// no eval with development, but generate *.map.js
options.devtool = 'cheap-module-source-map'

// Use cache with filesystem
options.cache = { type: 'filesystem' }

module.exports = options