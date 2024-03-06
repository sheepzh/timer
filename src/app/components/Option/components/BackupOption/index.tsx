/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"

import { t } from "@app/locale"
import optionService from "@service/option-service"
import processor from "@src/common/backup/processor"
import { defaultBackup } from "@util/constant/option"
import { ElInput, ElOption, ElSelect, ElAlert, ElButton, ElMessage, ElLoading } from "element-plus"
import { defineComponent, computed, ref, watch } from "vue"
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

const _default = defineComponent((_props, ctx) => {
    const backupType = ref(DEFAULT.backupType)
    const autoBackUp = ref(DEFAULT.autoBackUp)
    const autoBackUpInterval = ref(DEFAULT.autoBackUpInterval)
    const backupExts = ref(DEFAULT.backupExts)
    const backupAuths = ref(DEFAULT.backupAuths)
    const clientName = ref(DEFAULT.clientName)
    watch([
        backupType, autoBackUp, autoBackUpInterval, backupExts, backupAuths, clientName
    ], () => optionService.setBackupOption({
        backupType: backupType.value,
        autoBackUp: autoBackUp.value,
        autoBackUpInterval: autoBackUpInterval.value,
        backupExts: backupExts.value,
        backupAuths: backupAuths.value,
        clientName: clientName.value,
    }))

    optionService.getAllOption().then(val => {
        backupType.value = val?.backupType
        autoBackUp.value = val?.autoBackUp
        autoBackUpInterval.value = val?.autoBackUpInterval
        backupExts.value = val?.backupExts
        backupAuths.value = val?.backupAuths
        clientName.value = val?.clientName
    })

    const isObsidian = computed(() => backupType.value === "obsidian_local_rest_api")
    const isNotNone = computed(() => backupType.value !== "none")
    const auth: Ref<string> = computed({
        get: () => backupAuths.value?.[backupType?.value],
        set: val => {
            const typeVal = backupType.value
            if (!typeVal) return
            const newAuths = {
                ...backupAuths.value || {},
                [typeVal]: val,
            }
            backupAuths.value = newAuths
        }
    })
    const ext: Ref<timer.backup.TypeExt> = computed({
        get: () => backupExts.value?.[backupType.value],
        set: val => {
            const typeVal = backupType.value
            if (!typeVal) return
            const newExts = {
                ...backupExts.value || {},
                [typeVal]: val,
            }
            backupExts.value = newExts
        },
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
            backupType.value = DEFAULT.backupType
            autoBackUp.value = DEFAULT.autoBackUp
        }
    })
    return () => <>
        <ElAlert closable={false} type="warning" description={t(msg => msg.option.backup.alert, { email: AUTHOR_EMAIL })} />
        <OptionItem label={msg => msg.option.backup.type} defaultValue={TYPE_NAMES[DEFAULT.backupType]}>
            <ElSelect
                modelValue={backupType.value}
                size="small"
                onChange={(val: timer.backup.Type) => backupType.value = val}
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
                autoBackup={autoBackUp.value}
                interval={autoBackUpInterval.value}
                onChange={(autoBackUpVal, intervalVal) => {
                    autoBackUp.value = autoBackUpVal
                    autoBackUpInterval.value = intervalVal
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
            label={_ => AUTH_LABELS[backupType.value]}
            v-slots={{
                info: () => <OptionTooltip>{t(msg => msg.option.backup.meta[backupType.value]?.authInfo)}</OptionTooltip>
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
                modelValue={clientName.value}
                size="small"
                style={{ width: "120px" }}
                placeholder={DEFAULT.clientName}
                onInput={val => clientName.value = val?.trim?.() || ''}
            />
        </OptionItem>
        <Footer v-show={isNotNone.value} />
    </>
})

export default _default