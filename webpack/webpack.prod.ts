import FileManagerWebpackPlugin from "filemanager-webpack-plugin"
import path from "path"
import type { WebpackPluginInstance } from "webpack"
import manifest from "../src/manifest"
import optionGenerator from "./webpack.common"

const { name, version } = require(path.join(__dirname, '..', 'package.json'))

const outputPath = path.resolve(__dirname, '..', 'dist_prod')
const marketPkgPath = path.resolve(__dirname, '..', 'market_packages')

const normalZipFilePath = path.resolve(marketPkgPath, `${name}-${version}.mv3.zip`)

const filemanagerWebpackPlugin = new FileManagerWebpackPlugin({
    events: {
        // Archive at the end
        onEnd: [
            { delete: [path.join(outputPath, '*.LICENSE.txt')] },
            // Define plugin to archive zip for different markets
            {
                delete: [normalZipFilePath],
                archive: [{
                    source: outputPath,
                    destination: normalZipFilePath,
                }]
            },
        ]
    }
})

const option = optionGenerator({ outputPath, manifest, mode: "production" })

const { plugins = [] } = option
plugins.push(filemanagerWebpackPlugin as WebpackPluginInstance)
option.plugins = plugins

export default option