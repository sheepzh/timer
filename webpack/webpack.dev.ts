import path from "path"
import generateOption from "./webpack.common"
import manifest from "../src/manifest"

manifest.name = "IS DEV"

const options = generateOption({
    outputPath: path.join(__dirname, '..', 'dist_dev'),
    manifest,
    mode: "development",
})

export default options
