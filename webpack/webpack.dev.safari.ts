import path from "path"
import optionGenerator from "./webpack.common"

const outputDir = path.join(__dirname, '..', 'dist_dev_safari')

const options = optionGenerator(
  outputDir,
  baseManifest => {
    baseManifest.name = 'Timer_Safari_DEV'
  }
)

options.mode = 'development'
options.output.path = outputDir

// no eval with development, but generate *.map.js
options.devtool = 'cheap-module-source-map'

// Use cache with filesystem
options.cache = { type: 'filesystem' }

export default options