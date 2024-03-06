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
    useWildcard: string
    urlPlaceholder: string
    step1: string
    step2: string
    item: {
        condition: string
        time: string
        visitTime: string
        period: string
        enabled: string
        delayAllowed: string
        delayAllowedInfo: string
        waste: string
        operation: string
    }
    button: {
        test: string
        option: string
        parseUrl: string
        reEnterUrl: string
    }
    message: {
        noUrl: string
        noParsed: string
        noRule: string
        saved: string
        deleteConfirm: string
        deleted: string
        inputTestUrl: string
        clickTestButton: string
        noRuleMatched: string
        rulesMatched: string
    }
    verification: {
        inputTip: string
        inputTip2: string
        pswInputTip: string
        strictTip: string
        incorrectPsw: string
        incorrectAnswer: string
        pi: string
        confession: string
    }
}

export const verificationMessages: Messages<LimitMessage["verification"]> = {
    en: resource.en?.verification,
    zh_CN: resource.zh_CN?.verification,
    zh_TW: resource.zh_TW?.verification,
    ja: resource.ja?.verification,
    pt_PT: resource.pt_PT?.verification,
    uk: resource.uk?.verification,
}

const _default: Messages<LimitMessage> = resource

export default _default
