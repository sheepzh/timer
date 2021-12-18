/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import hostCol from "./host"
import aliasCol from "./alias"
import sourceCol from './source'
import operationCol, { OperationButtonColumnProps } from './operation'

type _Props = OperationButtonColumnProps

export type ColumnProps = _Props

const columns = (props: _Props) => [hostCol(), aliasCol(), sourceCol(), operationCol(props)]

export default columns