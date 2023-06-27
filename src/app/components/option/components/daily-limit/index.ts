/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { locale } from "@i18n"
import optionService from "@service/option-service"
import { defaultDailyLimit } from "@util/constant/option"
import { ElDivider, ElInput, ElOption, ElSelect } from "element-plus"
import { defineComponent, reactive, unref, UnwrapRef, h } from "vue"
import { renderOptionItem } from "../../common"
import "./daily-limit.sass"

const ALL_LIMIT_FILTER_TYPE: timer.limit.FilterType[] = [
    'translucent',
    'groundGlass',
]

const ALL_LEVEL: timer.limit.RestrictionLevel[] = [
    'nothing',
    'verification',
    'password',
]

const ALL_DIFF: timer.limit.VerificationDifficulty[] = [
    'easy',
    'hard',
    'disgusting',
]

const filterSelect = (option: timer.option.DailyLimitOption) => h(ElSelect, {
    modelValue: option.limitFilter,
    size: 'small',
    onChange: (val: timer.limit.FilterType) => {
        option.limitFilter = val
        optionService.setDailyLimitOption(unref(option))
    }
}, () => ALL_LIMIT_FILTER_TYPE.map(item => h(ElOption, { value: item, label: t(msg => msg.option.dailyLimit.filter[item]) })))

const levelSelect = (option: timer.option.DailyLimitOption) => h(ElSelect, {
    modelValue: option.limitLevel,
    size: 'small',
    class: `option-daily-limit-level-select ${locale}`,
    onChange: (val: timer.limit.RestrictionLevel) => {
        option.limitLevel = val
        optionService.setDailyLimitOption(unref(option))
    }
}, () => ALL_LEVEL.map(item => h(ElOption, { value: item, label: t(msg => msg.option.dailyLimit.level[item]) })))

const pswInput = (option: timer.option.DailyLimitOption) => h(ElInput, {
    modelValue: option.limitPassword,
    size: 'small',
    type: 'password',
    showPassword: true,
    style: { width: '200px' },
    onInput: (val: string) => {
        option.limitPassword = val?.trim()
        optionService.setDailyLimitOption(unref(option))
    }
})

const veriDiffSelect = (option: timer.option.DailyLimitOption) => h(ElSelect, {
    modelValue: option.limitVerifyDifficulty,
    size: 'small',
    onChange: (val: timer.limit.VerificationDifficulty) => {
        option.limitVerifyDifficulty = val
        optionService.setDailyLimitOption(unref(option))
    }
}, () => ALL_DIFF.map(item => h(ElOption, { value: item, label: t(msg => msg.option.dailyLimit.level.verificationDifficulty[item]) })))

function copy(target: timer.option.DailyLimitOption, source: timer.option.DailyLimitOption) {
    target.limitFilter = source.limitFilter
    target.limitLevel = source.limitLevel
    target.limitPassword = source.limitPassword
    target.limitVerifyDifficulty = source.limitVerifyDifficulty
}

function reset(target: timer.option.DailyLimitOption) {
    const defaultValue = defaultDailyLimit()
    // Not to reset limitPassword
    delete defaultValue.limitPassword
    // Not to reset difficulty
    delete defaultValue.limitVerifyDifficulty
    Object.entries(defaultValue).forEach(([key, val]) => target[key] = val)
}

const _default = defineComponent((_, ctx) => {
    const option: UnwrapRef<timer.option.DailyLimitOption> = reactive(defaultDailyLimit())
    optionService.getAllOption().then(currentVal => {
        copy(option, currentVal)
    })
    ctx.expose({
        reset: () => reset(option)
    })
    return () => {
        const nodes = [
            renderOptionItem({
                input: filterSelect(option)
            },
                msg => msg.dailyLimit.filter.label,
                t(msg => msg.option.dailyLimit.filter[defaultDailyLimit().limitFilter])
            ),
            h(ElDivider),
            renderOptionItem({
                input: levelSelect(option)
            },
                msg => msg.dailyLimit.level.label,
                t(msg => msg.option.dailyLimit.level[defaultDailyLimit().limitLevel])
            ),
        ]
        const { limitLevel } = option
        limitLevel === 'password' && nodes.push(
            h(ElDivider),
            renderOptionItem({
                input: pswInput(option),
            }, msg => msg.dailyLimit.level.passwordLabel)
        )
        limitLevel === 'verification' && nodes.push(
            h(ElDivider),
            renderOptionItem({
                input: veriDiffSelect(option),
            },
                msg => msg.dailyLimit.level.verificationLabel,
                t(msg => msg.option.dailyLimit.level[defaultDailyLimit().limitVerifyDifficulty])
            )
        )
        return nodes
    }
})

export default _default