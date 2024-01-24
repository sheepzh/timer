/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref, UnwrapRef } from "vue"

import { t } from "@app/locale"
import optionService from "@service/option-service"
import processor from "@src/common/backup/processor"
import { defaultBackup } from "@util/constant/option"
import { ElInput, ElOption, ElSelect, ElAlert, ElButton, ElMessage, ElLoading } from "element-plus"
import { defineComponent, computed, watch, reactive, unref } from "vue"
import { OptionItem, OptionTooltip } from "../../common"
import AutoInput from "./AutoInput"
import Footer from "./Footer"
import { AUTHOR_EMAIL } from "@src/package"
import { DEFAULT_ENDPOINT } from "@api/obsidian"
import "./style.sass"

const ALL_TYPES: timer.backup.Type[] = [
    'none',
    'gist',
    'obsidian_local_rest_api',
]

const AUTH_LABELS: { [t in timer.backup.Type]: string } = {
    'none': '',
    'gist': 'Personal Access Token {info} {input}',
    'obsidian_local_rest_api': 'Authorization {input}'
}

const TYPE_NAMES: { [t in timer.backup.Type]: string } = {
    none: t(msg => msg.option.backup.meta.none.label),
    gist: 'GitHub Gist',
    obsidian_local_rest_api: "Obsidian - Local REST API",
}

const DEFAULT = defaultBackup()

const copy = (target: timer.option.BackupOption, origin: timer.option.BackupOption) => {
    target.clientName = origin.clientName
    target.backupType = origin.backupType
    target.autoBackUp = origin.autoBackUp
    target.autoBackUpInterval = origin.autoBackUpInterval
    target.backupAuths = origin.backupAuths
    target.backupExts = origin.backupExts
}

const _default = defineComponent((_props, ctx) => {
    const option: UnwrapRef<timer.option.BackupOption> = reactive(defaultBackup())
    optionService.getAllOption().then(val => {
        copy(option, val)
        watch(option, () => optionService.setBackupOption(unref(option)))
    })

    const isObsidian = computed(() => option.backupType === "obsidian_local_rest_api")
    const isNotNone = computed(() => option.backupType !== "none")
    const auth: Ref<string> = computed({
        get: () => option.backupAuths[option.backupType],
        set: val => option.backupType && (option.backupAuths[option.backupType] = val),
    })
    const ext: Ref<timer.backup.TypeExt> = computed({
        get: () => option.backupExts[option.backupType],
        set: val => option.backupType && (option.backupExts[option.backupType] = val),
    })

    async function handleTest() {
        const loading = ElLoading.service({ text: "Please wait...." })
        const { errorMsg } = await processor.checkAuth()
        loading.close()
        if (!errorMsg) {
            ElMessage.success("Valid!")
        } else {
            ElMessage.error(errorMsg)
        }
    }

    ctx.expose({
        reset: () => {
            // Only reset type and auto flag
            option.backupType = DEFAULT.backupType
            option.autoBackUp = DEFAULT.autoBackUp
        }
    })
    return () => <>
        <ElAlert closable={false} type="warning" description={t(msg => msg.option.backup.alert, { email: AUTHOR_EMAIL })} />
        <OptionItem label={msg => msg.option.backup.type} defaultValue={TYPE_NAMES[DEFAULT.backupType]}>
            <ElSelect
                modelValue={option.backupType}
                size="small"
                onChange={(val: timer.backup.Type) => option.backupType = val}
            >
                {ALL_TYPES.map(type => <ElOption value={type} label={TYPE_NAMES[type]} />)}
            </ElSelect>
        </OptionItem >
        <OptionItem
            v-show={isNotNone.value}
            label={_ => "{input}"}
            defaultValue={t(msg => msg.option.no)}
        >
            <AutoInput
                autoBackup={option.autoBackUp}
                interval={option.autoBackUpInterval}
                onChange={(autoBackUpVal, intervalVal) => {
                    option.autoBackUp = autoBackUpVal
                    option.autoBackUpInterval = intervalVal
                }}
            />
        </OptionItem>
        <OptionItem
            v-show={isObsidian.value}
            label={msg => msg.option.backup.meta.obsidian_local_rest_api.endpointLabel}
            v-slots={{
                info: () => <OptionTooltip>{t(msg => msg.option.backup.meta.obsidian_local_rest_api.endpointInfo)}</OptionTooltip>
            }}
        >
            <ElInput
                placeholder={DEFAULT_ENDPOINT}
                modelValue={ext.value?.endpoint}
                size="small"
                style={{ width: "400px" }}
                onInput={val => ext.value = { ...(ext.value || {}), endpoint: val?.trim?.() || '' }}
            />
        </OptionItem>
        <OptionItem
            v-show={isObsidian.value}
            label={msg => msg.option.backup.meta.obsidian_local_rest_api.pathLabel}>
            <ElInput
                modelValue={ext.value?.dirPath}
                size="small"
                style={{ width: "400px" }}
                onInput={val => ext.value = { ...(ext.value || {}), dirPath: val?.trim?.() || '' }}
            />
        </OptionItem>
        <OptionItem
            v-show={isNotNone.value}
            label={_ => AUTH_LABELS[option.backupType]}
            v-slots={{
                info: () => <OptionTooltip>{t(msg => msg.option.backup.meta[option.backupType]?.authInfo)}</OptionTooltip>
            }}
        >
            <ElInput
                modelValue={auth.value}
                size="small"
                type="password"
                showPassword
                style={{ width: "400px" }}
                onInput={val => auth.value = val?.trim?.() || ''}
                v-slots={{
                    append: () => <ElButton onClick={handleTest}>{t(msg => msg.option.backup.test)}</ElButton>
                }}
            />
        </OptionItem>
        <OptionItem v-show={isNotNone.value} label={msg => msg.option.backup.client}>
            <ElInput
                modelValue={option.clientName}
                size="small"
                style={{ width: "120px" }}
                placeholder={DEFAULT.clientName}
                onInput={val => option.clientName = val?.trim?.() || ''}
            />
        </OptionItem>
        <Footer v-show={isNotNone.value} />
    </>
})

export default _default