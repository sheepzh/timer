import path from "path"
import generateOption from "./webpack.common"
import manifest from "../src/manifest"

manifest.name = "Time Tracker Safari Dev"

const options = generateOption({
    outputPath: path.join(__dirname, '..', 'dist_dev_safari'),
    manifest,
    mode: "development",
})

export default options