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
import { defineComponent, reactive, unref, UnwrapRef, ref, Ref } from "vue"
import { renderOptionItem } from "../../common"
import "./limit-option.sass"
import { judgeVerificationRequired, processVerification } from "@app/util/limit"
import limitService from "@service/limit-service"

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

const verifyTriggered = async (option: timer.option.DailyLimitOption, verified: Ref<boolean>): Promise<void> => {
    if (verified.value) return
    const items = await limitService.select({ filterDisabled: true, url: undefined })
    const triggerResults = await Promise.all((items || []).map(judgeVerificationRequired))
    const anyTrigger = triggerResults.some(t => !!t)
    if (!anyTrigger) {
        verified.value = true
        return
    }
    return processVerification(option).then(() => { verified.value = true })
}

const filterSelect = (option: timer.option.DailyLimitOption) =>
    <ElSelect
        modelValue={option.limitFilter}
        size="small"
        onChange={val => {
            option.limitFilter = val
            optionService.setDailyLimitOption(unref(option))
        }}
    >
        {
            ALL_LIMIT_FILTER_TYPE.map(item => <ElOption value={item} label={t(msg => msg.option.dailyLimit.filter[item])} />)
        }
    </ElSelect>


const levelSelect = (option: timer.option.DailyLimitOption, verified: Ref<boolean>) =>
    <ElSelect
        modelValue={option.limitLevel}
        size="small"
        class={`option-daily-limit-level-select ${locale}`}
        onChange={(val: timer.limit.RestrictionLevel) => verifyTriggered(option, verified)
            .then(() => {
                option.limitLevel = val
                optionService.setDailyLimitOption(unref(option))
            }).catch(console.log)
        }
    >
        {ALL_LEVEL.map(item => <ElOption value={item} label={t(msg => msg.option.dailyLimit.level[item])} />)}
    </ElSelect>

const pswInput = (option: timer.option.DailyLimitOption, verified: Ref<boolean>) =>
    <ElInput
        modelValue={option.limitPassword}
        size="small"
        type="password"
        showPassword
        style={{ width: "200px" }}
        onInput={val => verifyTriggered(option, verified)
            .then(() => {
                option.limitPassword = val?.trim()
                optionService.setDailyLimitOption(unref(option))
            }).catch(console.log)
        }
    />

const veriDiffSelect = (option: timer.option.DailyLimitOption, verified: Ref<boolean>) =>
    <ElSelect
        modelValue={option.limitVerifyDifficulty}
        size="small"
        onChange={(val: timer.limit.VerificationDifficulty) => verifyTriggered(option, verified)
            .then(() => {
                option.limitVerifyDifficulty = val
                optionService.setDailyLimitOption(unref(option))
            }).catch(console.log)
        }
    >
        {ALL_DIFF.map(item => <ElOption value={item} label={t(msg => msg.option.dailyLimit.level.verificationDifficulty[item])} />)}
    </ElSelect>

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
    const verified = ref(false)
    optionService.getAllOption().then(currentVal => {
        copy(option, currentVal)
    })
    ctx.expose({ reset: () => reset(option) })
    return () => <>
        {
            renderOptionItem(
                filterSelect(option),
                msg => msg.dailyLimit.filter.label,
                t(msg => msg.option.dailyLimit.filter[defaultDailyLimit().limitFilter]),
            )
        }
        <ElDivider />
        {
            renderOptionItem(
                levelSelect(option, verified),
                msg => msg.dailyLimit.level.label,
                t(msg => msg.option.dailyLimit.level[defaultDailyLimit().limitLevel]),
            )
        }
        {
            option.limitLevel === "password" && <>
                <ElDivider />
                {renderOptionItem(pswInput(option, verified), msg => msg.dailyLimit.level.passwordLabel)}
            </>
        }
        {
            option.limitLevel === "verification" && <>
                <ElDivider />
                {
                    renderOptionItem(
                        veriDiffSelect(option, verified),
                        msg => msg.dailyLimit.level.verificationLabel,
                        t(msg => msg.option.dailyLimit.level[defaultDailyLimit().limitVerifyDifficulty])
                    )
                }
            </>
        }
    </>
})

export default _default