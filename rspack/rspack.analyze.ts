import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin"
import path from "path"
import manifest from "../src/manifest"
import optionGenerator from "./rspack.common"

const outputPath = path.resolve(__dirname, '..', 'dist_prod')
const option = optionGenerator({ outputPath, manifest, mode: "production" })

const { plugins = [] } = option
plugins.push(new RsdoctorRspackPlugin())
option.plugins = plugins

export default option