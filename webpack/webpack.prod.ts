import optionGenerator from './webpack.common'
import * as path from 'path'
import FileManagerWebpackPlugin from 'filemanager-webpack-plugin'
import webpack from 'webpack'

const { name, version } = require(path.join(__dirname, '..', 'package.json'))

const outputDir = path.resolve(__dirname, '..', 'dist_prod')
const options = optionGenerator(outputDir)

const normalZipFilePath = path.resolve(__dirname, '..', 'market_packages', `${name}-${version}.zip`)
const sourceCodeForFireFox = path.resolve(__dirname, '..', 'market_packages', `${name}-${version}-src.zip`)

// Temperary directory for source code to archive on Firefox
const sourceTempDir = path.resolve(__dirname, '..', 'firefox')

const srcDir = ['public', 'src', 'package.json', 'tsconfig.json', 'webpack']
const copyMapper = srcDir.map(p => { return { source: path.resolve(__dirname, '..', p), destination: path.resolve(sourceTempDir, p) } })

const readmeForForfix = path.join(__dirname, '..', 'doc', 'for-fire-fox.md')

const filemanagerWebpackPlugin = new FileManagerWebpackPlugin({
    events: {
        // Archive at the end
        onEnd: [
            { delete: [path.join(outputDir, '*.LICENSE.txt')] },
            // Define plugin to archive zip for differrent markets
            {
                delete: [normalZipFilePath],
                archive: [{ source: outputDir, destination: normalZipFilePath }]
            },
            // Archive srouce code for FireFox
            {
                copy: [
                    { source: readmeForForfix, destination: path.join(sourceTempDir, 'README.md') },
                    { source: readmeForForfix, destination: path.join(sourceTempDir, 'doc', 'for-fire-fox.md') },
                    ...copyMapper
                ],
                archive: [
                    { source: sourceTempDir, destination: sourceCodeForFireFox },
                ],
                delete: [sourceTempDir]
            }
        ]
    }
})

options.plugins.push(filemanagerWebpackPlugin as webpack.WebpackPluginInstance)

options.output.path = outputDir

export default options