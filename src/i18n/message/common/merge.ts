/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from "./merge-resource.json"

export type MergeMessage = {
    mergeBy: string
    mergeMethod: Record<timer.stat.MergeMethod, string>
}

const mergeMessages = resource satisfies Messages<MergeMessage>

export default mergeMessages