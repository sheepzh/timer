/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { judgeVerificationRequired, processVerification } from "@app/util/limit"
import { Edit, Lock } from "@element-plus/icons-vue"
import limitService from "@service/limit-service"
import optionService from "@service/option-service"
import { defaultDailyLimit } from "@util/constant/option"
import { ElButton, ElInput, ElMessage, ElMessageBox, ElOption, ElSelect } from "element-plus"
import { defineComponent, reactive, ref, type Ref, unref, type UnwrapRef, watch } from "vue"
import { type OptionInstance } from "../../common"
import OptionItem from "../OptionItem"
import "./limit-option.sass"

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
    target.limitPrompt = source.limitPrompt
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

const modifyPsw = async (oldPsw?: string): Promise<string> => {
    const content = t(msg => msg.option.dailyLimit.level.passwordContent)
    const data = await ElMessageBox({
        message: content,
        type: 'success',
        icon: <Lock />,
        confirmButtonText: t(msg => msg.button.save),
        showCancelButton: true,
        cancelButtonText: t(msg => msg.button.cancel),
        showInput: true,
        inputValue: oldPsw,
        closeOnClickModal: false,
    })
    const { action, value } = data || {}
    if (action !== 'confirm') {
        ElMessage.warning("Unknown action: " + action)
        throw "Ignore this message"
    } else if (!value) {
        ElMessage.error("No password filled in")
        throw "No password filled in"
    }
    return value
}

const _default = defineComponent((_, ctx) => {
    const option: UnwrapRef<timer.option.DailyLimitOption> = reactive(defaultDailyLimit())
    const verified = ref(false)
    optionService.getAllOption().then(currentVal => {
        copy(option, currentVal)
        watch(option, () => optionService.setDailyLimitOption(unref(option)))
    })
    ctx.expose({
        reset: () => verifyTriggered(option, verified)
            .then(() => reset(option))
            .catch(() => { })
    } satisfies OptionInstance)

    const handleLevelChange = async (val: timer.limit.RestrictionLevel) => {
        try {
            await verifyTriggered(option, verified)
            if (val === "strict") {
                await confirm4Strict()
            } else if (val === "password") {
                option.limitPassword = await modifyPsw()
            }
            option.limitLevel = val
        } catch (e) {
            console.log("Failed to verify", e)
        }
    }

    const handlePswEdit = async () => {
        try {
            await verifyTriggered(option, verified)
            option.limitPassword = await modifyPsw(option.limitPassword)
            ElMessage.success(t(msg => msg.operation.successMsg))
        } catch (e) {
            console.log("Failed to verify", e)
        }
    }

    return () => <>
        <OptionItem
            label={msg => msg.option.dailyLimit.level.label}
            defaultValue={t(msg => msg.option.dailyLimit.level[defaultDailyLimit().limitLevel])}
            hideDivider
        >
            <ElSelect
                modelValue={option.limitLevel}
                size="small"
                class='option-daily-limit-level-select'
                onChange={handleLevelChange}
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
                showPassword={verified.value}
                style={{ width: "300px" }}
                v-slots={{
                    append: () => <ElButton icon={<Edit />} onClick={handlePswEdit} />,
                }}
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
            <ElButton size="small" onClick={() => processVerification(option)}>
                {t(msg => msg.button.test)}
            </ElButton>
        </OptionItem>
        <OptionItem label={msg => msg.option.dailyLimit.prompt}>
            <ElInput
                modelValue={option.limitPrompt}
                size="small"
                onInput={val => option.limitPrompt = val}
                placeholder={t(msg => msg.limitModal.defaultPrompt)}
                style={{ width: "280px" }}
            />
        </OptionItem>
    </>
})

export default _default