/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './limit-resource.json'

export type LimitMessage = {
    conditionFilter: string
    filterDisabled: string
    addTitle: string
    useWildcard: string
    urlPlaceholder: string
    item: {
        condition: string
        time: string
        enabled: string
        delayAllowed: string
        delayAllowedInfo: string
        waste: string
        operation: string
    }
    button: {
        add: string
        test: string
        testSimple: string
        paste: string
        save: string
        delete: string
        modify: string
    }
    message: {
        noUrl: string
        noTime: string
        saved: string
        deleteConfirm: string
        deleted: string
        noPermissionFirefox: string
        inputTestUrl: string
        clickTestButton: string
        noRuleMatched: string
        rulesMatched: string
    }
    testUrlLabel: string
}

const _default: Messages<LimitMessage> = resource

export default _default