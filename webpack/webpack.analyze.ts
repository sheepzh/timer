// Copyright (c) 2021 Hengyang Zhang
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import path from 'path'
import optionGenerator from "./webpack.common"
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

const option = optionGenerator(path.join(__dirname, '..', 'dist_analyze'))
option.mode = 'production'

option.plugins.push(new BundleAnalyzerPlugin())

export default option