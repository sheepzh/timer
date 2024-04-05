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
import { ElInput, ElMessageBox, ElOption, ElSelect } from "element-plus"
import { defineComponent, reactive, unref, UnwrapRef, ref, Ref, watch } from "vue"
import { OptionItem } from "../../common"
import "./limit-option.sass"
import { judgeVerificationRequired, processVerification } from "@app/util/limit"
import limitService from "@service/limit-service"

const ALL_FILTER: timer.limit.FilterType[] = [
    'translucent',
    'groundGlass',
]

const ALL_LEVEL: timer.limit.RestrictionLevel[] = [
    'nothing',
    'verification',
    'password',
    'strict',
]

const ALL_DIFF: timer.limit.VerificationDifficulty[] = [
    'easy',
    'hard',
    'disgusting',
]

const verifyTriggered = async (option: timer.option.DailyLimitOption, verified: Ref<boolean>): Promise<void> => {
    if (verified.value) return
    const items = await limitService.select({ filterDisabled: true, url: undefined })
    const triggerResults = await Promise.all((items || []).map(judgeVerificationRequired))
    const anyTrigger = triggerResults.some(t => !!t)
    if (!anyTrigger) {
        verified.value = true
        return
    }
    const promise = processVerification(option)
    return (promise || Promise.resolve()).then(() => { verified.value = true })
}

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

const confirm4Strict = async (): Promise<void> => {
    const title = t(msg => msg.option.dailyLimit.level.strictTitle)
    const content = t(msg => msg.option.dailyLimit.level.strictContent)
    await ElMessageBox.confirm(content, title, {
        type: "warning",
        confirmButtonText: t(msg => msg.button.confirm),
        cancelButtonText: t(msg => msg.button.cancel),
    })
}

const _default = defineComponent((_, ctx) => {
    const option: UnwrapRef<timer.option.DailyLimitOption> = reactive(defaultDailyLimit())
    const verified = ref(false)
    optionService.getAllOption().then(currentVal => {
        copy(option, currentVal)
        watch(option, () => optionService.setDailyLimitOption(unref(option)))
    })
    ctx.expose({ reset: () => reset(option) })

    return () => <>
        <OptionItem
            label={msg => msg.option.dailyLimit.filter.label}
            defaultValue={t(msg => msg.option.dailyLimit.filter[defaultDailyLimit().limitFilter])}
            hideDivider
        >
            <ElSelect
                modelValue={option.limitFilter}
                size="small"
                onChange={val => option.limitFilter = val}
            >
                {ALL_FILTER.map(item => <ElOption value={item} label={t(msg => msg.option.dailyLimit.filter[item])} />)}
            </ElSelect>
        </OptionItem>
        <OptionItem
            label={msg => msg.option.dailyLimit.level.label}
            defaultValue={t(msg => msg.option.dailyLimit.level[defaultDailyLimit().limitLevel])}
        >
            <ElSelect
                modelValue={option.limitLevel}
                size="small"
                class={`option-daily-limit-level-select ${locale}`}
                onChange={(val: timer.limit.RestrictionLevel) => verifyTriggered(option, verified)
                    .then(() => val === "strict" ? confirm4Strict() : Promise.resolve())
                    .then(() => option.limitLevel = val)
                    .catch(console.log)
                }
            >
                {ALL_LEVEL.map(item => <ElOption value={item} label={t(msg => msg.option.dailyLimit.level[item])} />)}
            </ElSelect>
        </OptionItem>
        <OptionItem
            v-show={option.limitLevel === "password"}
            label={msg => msg.option.dailyLimit.level.passwordLabel}
        >
            <ElInput
                modelValue={option.limitPassword}
                size="small"
                type="password"
                showPassword
                style={{ width: "200px" }}
                onInput={val => verifyTriggered(option, verified)
                    .then(() => option.limitPassword = val?.trim())
                    .catch(console.log)
                }
            />
        </OptionItem>
        <OptionItem
            v-show={option.limitLevel === "verification"}
            label={msg => msg.option.dailyLimit.level.verificationLabel}
            defaultValue={t(msg => msg.option.dailyLimit.level[defaultDailyLimit().limitVerifyDifficulty])}
        >
            <ElSelect
                modelValue={option.limitVerifyDifficulty}
                size="small"
                onChange={(val: timer.limit.VerificationDifficulty) => verifyTriggered(option, verified)
                    .then(() => option.limitVerifyDifficulty = val)
                    .catch(console.log)
                }
            >
                {ALL_DIFF.map(item => <ElOption value={item} label={t(msg => msg.option.dailyLimit.level.verificationDifficulty[item])} />)}
            </ElSelect>
        </OptionItem>
    </>
})

export default _default