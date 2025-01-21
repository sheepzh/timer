/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './limit-resource.json'

export type LimitMessage = {
    filterDisabled: string
    useWildcard: string
    urlPlaceholder: string
    step: {
        base: string
        url: string
        rule: string
    }
    item: {
        name: string
        condition: string
        daily: string
        weekly: string
        weekStartInfo: string
        visitTime: string
        period: string
        enabled: string
        effectiveDay: string
        delayAllowed: string
        delayAllowedInfo: string
        delayCount: string
        detail: string
        visits: string
        or: string
        notEffective: string
    }
    button: {
        test: string
        parseUrl: string
    }
    message: {
        noUrl: string
        noRule: string
        deleteConfirm: string
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
