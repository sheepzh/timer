/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './privacy-resource.json'

type _StoreKey =
    | 'title'
    | 'p1'
    | 'p2'
    | 'p3'


type RequiredScope = {
    name: string
    usage: string
}

type OptionalScope = RequiredScope & {
    optionalReason: string
}

export type Scope = RequiredScope & {
    optionalReason?: string
}

export type PrivacyMessage = {
    title: string
    alert: string
    scope: {
        title: string
        cols: {
            name: string
            usage: string
            required: string
        }
        rows: {
            website: RequiredScope
            tab: OptionalScope
            clipboard: OptionalScope
        }
    }
    storage: { [key in _StoreKey]: string }
}

const _default: Messages<PrivacyMessage> = resource

export default _default