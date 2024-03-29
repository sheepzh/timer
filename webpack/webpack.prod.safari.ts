import path from "path"
import generateOption from "./webpack.common"
import FileManagerWebpackPlugin from "filemanager-webpack-plugin"
import webpack from "webpack"
import manifest from "../src/manifest"

const { name, version } = require(path.join(__dirname, '..', 'package.json'))

const outputPath = path.join(__dirname, '..', 'dist_prod_safari')
const normalZipFilePath = path.resolve(__dirname, '..', 'market_packages', `${name}-${version}-safari.zip`)

const options = generateOption({ outputPath, manifest, mode: "production" })

const filemanagerWebpackPlugin = new FileManagerWebpackPlugin({
    events: {
        // Archive at the end
        onEnd: [
            { delete: [path.join(outputPath, '*.LICENSE.txt')] },
            // Define plugin to archive zip for different markets
            {
                delete: [normalZipFilePath],
                archive: [{ source: outputPath, destination: normalZipFilePath }]
            }
        ]
    }
})

options.plugins.push(filemanagerWebpackPlugin as webpack.WebpackPluginInstance)

export default options