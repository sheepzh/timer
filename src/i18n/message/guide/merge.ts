/**
 * Copyright (c) 2023-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './merge-resource.json'

export type MergeMessage = {
    title: string
    p1: string
    p2: string
    lookTitle: string
    p3: string
    sourceCol: string
    targetCol: string
    remarkCol: string
    source: {
        title: string
        p1: string
        exampleCol: string
        only: string
    }
    target: {
        title: string
        p1: string
        lookCol: string
        remark: {
            blank: string
            spec: string
            integer: string
            specFirst: string
            miss: string
        }
        p2: string
        originalCol: string
        mergedCol: string
        hitCol: string
    }
}

const _default: Messages<MergeMessage> = resource

export default _default
