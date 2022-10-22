import path from "path"
import optionGenerator from "./webpack.common"

const outputDir = path.join(__dirname, '..', 'dist_dev_safari')

function removeUnsupportedProperties(manifest: Partial<chrome.runtime.ManifestV3>) {
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
    baseManifest.name = 'Timer_Safari_DEV'
    // Remove unsupported properties in Safari
    removeUnsupportedProperties(baseManifest)
  }
)

options.mode = 'development'
options.output.path = outputDir

// no eval with development, but generate *.map.js
options.devtool = 'cheap-module-source-map'

// Use cache with filesystem
options.cache = { type: 'filesystem' }

export default options