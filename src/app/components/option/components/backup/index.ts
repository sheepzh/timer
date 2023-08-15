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
import { ElInput, ElOption, ElSelect, ElDivider, ElAlert, ElButton, ElMessage, ElLoading } from "element-plus"
import { defineComponent, ref, h } from "vue"
import { renderOptionItem, tooltip } from "../../common"
import BackUpAutoInput from "./auto-input"
import Footer from "./footer"
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

const typeOptions = () => ALL_TYPES.map(type => h(ElOption, {
    value: type,
    label: TYPE_NAMES[type],
}))

const clientNameInput = (clientName: Ref<string>, handleInput?: Function) => h(ElInput, {
    modelValue: clientName.value,
    size: 'small',
    style: { width: '120px' },
    placeholder: DEFAULT.clientName,
    onInput: newVal => {
        clientName.value = newVal?.trim?.() || ''
        handleInput?.()
    }
})

const authInput = (auth: Ref<string>, handleInput: Function, handleTest: Function) => h(ElInput, {
    modelValue: auth.value,
    size: 'small',
    type: 'password',
    showPassword: true,
    style: { width: '400px' },
    onInput: newVal => {
        auth.value = newVal?.trim?.() || ''
        handleInput()
    }
}, {
    append: () => h(ElButton, {
        onClick: () => handleTest()
    }, () => t(msg => msg.option.backup.test))
})

const DEFAULT = defaultBackup()

const _default = defineComponent((_props, ctx) => {
    const type: Ref<timer.backup.Type> = ref(DEFAULT.backupType)
    const auth: Ref<string> = ref('')
    const endpoint: Ref<string> = ref()
    const path: Ref<string> = ref()
    const clientName: Ref<string> = ref(DEFAULT.clientName)
    const autoBackUp: Ref<boolean> = ref(DEFAULT.autoBackUp)
    const autoBackUpInterval: Ref<number> = ref(DEFAULT.autoBackUpInterval)

    const parseOption = (option: timer.option.BackupOption) => {
        clientName.value = option.clientName
        type.value = option.backupType
        if (type.value) {
            auth.value = option.backupAuths?.[type.value]
            const ext = option.backupExts?.[type.value]
            path.value = ext?.dirPath
            endpoint.value = ext?.endpoint
        }
        autoBackUp.value = option.autoBackUp
        autoBackUpInterval.value = option.autoBackUpInterval
    }

    optionService.getAllOption().then(parseOption)

    async function handleChange() {
        const backupAuths = {}
        const backupExts: { [type in timer.backup.Type]?: timer.backup.TypeExt } = {}
        backupAuths[type.value] = auth.value
        backupExts[type.value] = {
            dirPath: path.value,
            endpoint: endpoint.value,
        }
        const newOption: timer.option.BackupOption = {
            backupType: type.value,
            backupAuths,
            backupExts,
            clientName: clientName.value || DEFAULT.clientName,
            autoBackUp: autoBackUp.value,
            autoBackUpInterval: autoBackUpInterval.value,
        }
        await optionService.setBackupOption(newOption)
    }

    async function handleTest() {
        const loading = ElLoading.service({
            text: "Please wait...."
        })
        const { errorMsg } = await processor.checkAuth()
        loading.close()
        if (!errorMsg) {
            ElMessage.success("Valid!")
        } else {
            ElMessage.error(errorMsg)
        }
    }

    ctx.expose({
        async reset() {
            // Only reset type and auto flag
            type.value = DEFAULT.backupType
            autoBackUp.value = DEFAULT.autoBackUp
            handleChange()
        }
    })

    return () => {
        const nodes = [
            h(ElAlert, {
                closable: false,
                type: "warning",
                description: t(msg => msg.option.backup.alert, { email: AUTHOR_EMAIL })
            }),
            h(ElDivider),
            renderOptionItem({
                input: h(ElSelect, {
                    modelValue: type.value,
                    size: 'small',
                    async onChange(newType: timer.backup.Type) {
                        type.value = newType
                        const option = await optionService.getAllOption()
                        option.backupType = type.value
                        await optionService.setBackupOption(option)
                        parseOption(option)
                    }
                }, () => typeOptions())
            },
                msg => msg.backup.type,
                TYPE_NAMES[DEFAULT.backupType],
            ),
        ]
        type.value !== 'none' && nodes.push(
            h(ElDivider),
            renderOptionItem({
                input: h(BackUpAutoInput, {
                    autoBackup: autoBackUp.value,
                    interval: autoBackUpInterval.value,
                    onChange(newAutoBackUp, newInterval) {
                        autoBackUp.value = newAutoBackUp
                        autoBackUpInterval.value = newInterval
                        handleChange()
                    }
                })
            }, _msg => '{input}', t(msg => msg.option.no)),
        )
        type.value === 'obsidian_local_rest_api' && nodes.push(
            h(ElDivider),
            renderOptionItem({
                input: h(ElInput, {
                    placeholder: DEFAULT_ENDPOINT,
                    modelValue: endpoint.value,
                    size: "small",
                    style: { width: "400px" } as Partial<CSSStyleDeclaration>,
                    onInput: val => {
                        endpoint.value = val?.trim?.() || ''
                        handleChange()
                    },
                }),
                info: tooltip(msg => msg.option.backup.meta.obsidian_local_rest_api.endpointInfo),
            }, msg => msg.backup.meta.obsidian_local_rest_api.endpointLabel),
            h(ElDivider),
            renderOptionItem(
                h(ElInput, {
                    modelValue: path.value,
                    size: "small",
                    style: { width: "400px" } as Partial<CSSStyleDeclaration>,
                    onInput: val => {
                        path.value = val?.trim?.() || ''
                        handleChange()
                    },
                }),
                msg => msg.backup.meta.obsidian_local_rest_api.pathLabel,
            ),
        )
        type.value !== 'none' && nodes.push(
            h(ElDivider),
            renderOptionItem({
                input: authInput(auth, handleChange, handleTest),
                info: tooltip(msg => msg.option.backup.meta[type.value]?.authInfo)
            },
                _msg => AUTH_LABELS[type.value],
            ),
            h(ElDivider),
            renderOptionItem(
                clientNameInput(clientName, handleChange),
                msg => msg.backup.client,
            ),
            h(ElDivider),
            h(Footer, { type: type.value }),
        )
        return h('div', nodes)
    }
})

export default _default