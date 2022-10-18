import path from "path"
import optionGenerator from "./webpack.common"
import FileManagerWebpackPlugin from "filemanager-webpack-plugin"
import webpack from "webpack"

const { name, version } = require(path.join(__dirname, '..', 'package.json'))

const outputDir = path.join(__dirname, '..', 'dist_prod_safari')
const normalZipFilePath = path.resolve(__dirname, '..', 'market_packages', `${name}-${version}-safari.zip`)

function removeUnsupportedProperties(manifest: Partial<chrome.runtime.ManifestV2>) {
    // 1. permissions. 'idle' is not supported
    const originPermissions = manifest.permissions || []
    const unsupported = ['idle']
    const supported = []
    originPermissions.forEach(perm => !unsupported.includes(perm) && supported.push(perm))
    manifest.permissions = supported
}

const options = optionGenerator(
    outputDir,
    baseManifest => {
        baseManifest.name = 'Timer'
        // Remove unsupported properties in Safari
        removeUnsupportedProperties(baseManifest)
    }
)

const filemanagerWebpackPlugin = new FileManagerWebpackPlugin({
    events: {
        // Archive at the end
        onEnd: [
            { delete: [path.join(outputDir, '*.LICENSE.txt')] },
            // Define plugin to archive zip for different markets
            {
                delete: [normalZipFilePath],
                archive: [{ source: outputDir, destination: normalZipFilePath }]
            }
        ]
    }
})

options.mode = 'production'
options.plugins.push(filemanagerWebpackPlugin as webpack.WebpackPluginInstance)
options.output.path = outputDir

export default options