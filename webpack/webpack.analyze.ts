// Copyright (c) 2021 Hengyang Zhang
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import path from 'path'
import generateOption from "./webpack.common"
import { RsdoctorWebpackPlugin } from '@rsdoctor/webpack-plugin'
import manifest from '../src/manifest'

const option = generateOption({
    outputPath: path.join(__dirname, '..', 'dist_analyze'),
    manifest,
    mode: "production",
})

option.optimization.minimize = true
option.optimization.usedExports = true
option.plugins.push(new RsdoctorWebpackPlugin())

export default option