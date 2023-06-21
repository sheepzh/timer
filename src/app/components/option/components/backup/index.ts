/**
 * Copyright (c) 2022-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"
import type { I18nKey } from "@app/locale"

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

const ALL_TYPES: timer.backup.Type[] = [
    'none',
    'gist',
]

const AUTH_LABELS: { [t in timer.backup.Type]: string } = {
    'none': '',
    'gist': 'Personal Access Token {info} {input}',
}

const TYPE_NAMES: { [t in timer.backup.Type]: I18nKey } = {
    none: msg => msg.option.backup.meta.none.label,
    gist: _ => 'GitHub Gist',
}

const typeOptions = () => ALL_TYPES.map(type => h(ElOption, {
    value: type,
    label: t(TYPE_NAMES[type]),
}))

const typeSelect = (type: Ref<timer.backup.Type>, handleChange?: Function) => h(ElSelect,
    {
        modelValue: type.value,
        size: 'small',
        style: { width: '120px' },
        async onChange(newType: timer.backup.Type) {
            type.value = newType
            handleChange?.()
        }
    },
    () => typeOptions()
)

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
    const clientName: Ref<string> = ref(DEFAULT.clientName)
    const autoBackUp: Ref<boolean> = ref(DEFAULT.autoBackUp)
    const autoBackUpInterval: Ref<number> = ref(DEFAULT.autoBackUpInterval)

    optionService.getAllOption().then(currentVal => {
        clientName.value = currentVal.clientName
        type.value = currentVal.backupType
        if (type.value) {
            auth.value = currentVal.backupAuths?.[type.value]
        }
        autoBackUp.value = currentVal.autoBackUp
        autoBackUpInterval.value = currentVal.autoBackUpInterval
    })

    function handleChange() {
        const backupAuths = {}
        backupAuths[type.value] = auth.value
        const newOption: timer.option.BackupOption = {
            backupType: type.value,
            backupAuths,
            clientName: clientName.value || DEFAULT.clientName,
            autoBackUp: autoBackUp.value,
            autoBackUpInterval: autoBackUpInterval.value,
        }
        optionService.setBackupOption(newOption)
    }

    async function handleTest() {
        const loading = ElLoading.service({
            text: "Please wait...."
        })
        const errorMsg = await processor.test(type.value, auth.value)
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
                input: typeSelect(type, handleChange)
            },
                msg => msg.backup.type,
                t(TYPE_NAMES[DEFAULT.backupType])
            )
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
            h(ElDivider),
            renderOptionItem({
                input: authInput(auth, handleChange, handleTest),
                info: tooltip(msg => msg.option.backup.meta[type.value]?.authInfo)
            },
                _msg => AUTH_LABELS[type.value],
            ),
            h(ElDivider),
            renderOptionItem({
                input: clientNameInput(clientName, handleChange)
            },
                msg => msg.backup.client
            ),
            h(ElDivider),
            h(Footer, { type: type.value }),
        )
        return h('div', nodes)
    }
})

export default _default