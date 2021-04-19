const optionGenerator = require('./webpack.base')
const path = require('path')
const FileManagerWebpackPlugin = require('filemanager-webpack-plugin')

const { name, version } = require(path.join(__dirname, '..', 'package.json'))

const outputDir = path.join(__dirname, '..', 'dist_prod')
const options = optionGenerator(outputDir)

const normalZipFilePath = path.join(__dirname, '..', 'market_packages', `${name}-${version}.zip`)
const sourceCodeForFireFox = path.join(__dirname, '..', 'market_packages', `${name}-${version}-src.zip`)

// Temperary directory for source code to archive on Firefox
const sourceTempDir = path.join(__dirname, '..', 'firefox')

const srcDir = ['public', 'src', 'package.json', 'tsconfig.json', 'webpack']
const copyMapper = srcDir.map(p => { return { source: path.join(__dirname, '..', p), destination: path.join(sourceTempDir, p) } })

const readmeForForfix = path.join(__dirname, '..', 'doc', 'for-fire-fox.md')

options.plugins.push(
    new FileManagerWebpackPlugin({
        events: {
            onStart: [{ delete: [path.join(outputDir, '*')] }],
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
)

options.output.path = outputDir

module.exports = options