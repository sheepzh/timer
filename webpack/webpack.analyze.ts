// Copyright (c) 2021 Hengyang Zhang
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { RsdoctorWebpackPlugin } from '@rsdoctor/webpack-plugin'
import path from 'path'
import { type Configuration } from 'webpack'
import manifest from '../src/manifest'
import generateOption from "./webpack.common"

const option = generateOption({
    outputPath: path.join(__dirname, '..', 'dist_analyze'),
    manifest,
    mode: "production",
})

const { optimization = {}, plugins = [] } = option
optimization.minimize = true
optimization.usedExports = true
plugins.push(new RsdoctorWebpackPlugin())

export default { ...option, optimization, plugins } satisfies Configuration