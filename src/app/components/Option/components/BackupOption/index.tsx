/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"

import { t } from "@app/locale"
import optionService from "@service/option-service"
import { defaultBackup } from "@util/constant/option"
import { ElInput, ElOption, ElSelect, ElAlert } from "element-plus"
import { defineComponent, computed, ref, watch } from "vue"
import { OptionInstance, OptionItem, OptionTooltip } from "../../common"
import AutoInput from "./AutoInput"
import Footer from "./Footer"
import { AUTHOR_EMAIL } from "@src/package"
import "./style.sass"
import { ALL_TYPES, AUTH_LABELS, EXT_LABELS, TYPE_NAMES } from "./label"

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

    const isNotNone = computed(() => backupType.value !== "none")
    const auth = computed({
        get: () => {
            const auth = backupAuths.value[backupType.value]
            if (!auth) {
                backupAuths.value[backupType.value] = {}
            }
            return auth
        },
        set: val => {
            const typeVal = backupType.value
            if (!typeVal) return
            const newAuths = {
                ...(backupAuths.value || {}),
                [typeVal]: val,
            }
            backupAuths.value = newAuths
        }
    })
    const ext = computed<timer.backup.TypeExt>({
        get: () => {
            const ext = backupExts.value[backupType.value]
            if (!ext) {
                backupExts.value[backupType.value] = {}
            }
            return ext
        },
        set: val => {
            const typeVal = backupType.value
            if (!typeVal) return
            const newExts = {
                ...(backupExts.value || {}),
                [typeVal]: val,
            }
            backupExts.value = newExts
        },
    })

    ctx.expose({
        reset: () => {
            // Only reset type and auto flag
            backupType.value = DEFAULT.backupType
            autoBackUp.value = DEFAULT.autoBackUp
        }
    } satisfies OptionInstance)
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
        {isNotNone.value &&
            EXT_LABELS[backupType.value].map((item, index) => {
                return (
                    <OptionItem
                        key={item.name}
                        label={(_) => item.label}
                    // v-slots={{
                    //     info: () => (
                    //         <OptionTooltip>
                    //             {t(
                    //                 (msg) =>
                    //                     msg.option.backup.meta[
                    //                         backupType.value
                    //                     ]?.authInfo
                    //             )}
                    //         </OptionTooltip>
                    //     ),
                    // }}
                    >
                        <ElInput
                            modelValue={ext.value[item.name]}
                            size="small"
                            key={index}
                            style={{ width: "400px" }}
                            onInput={(val) => {
                                ext.value[item.name] = val?.trim?.() || ""
                            }}
                        />
                    </OptionItem>
                )
            })}

        {isNotNone.value &&
            AUTH_LABELS[backupType.value].map((item, index) => {
                return (
                    <OptionItem
                        key={item.name}
                        label={(_) => item.label}
                    // v-slots={{
                    //     info: () => (
                    //         <OptionTooltip>
                    //             {t(
                    //                 (msg) =>
                    //                     msg.option.backup.meta[
                    //                         backupType.value
                    //                     ]?.authInfo
                    //             )}
                    //         </OptionTooltip>
                    //     ),
                    // }}
                    >
                        <ElInput
                            modelValue={auth.value[item.name]}
                            size="small"
                            key={index}
                            type="password"
                            showPassword
                            style={{ width: "400px" }}
                            onInput={(val) => {
                                auth.value[item.name] = val?.trim?.() || ""
                            }}
                        />
                    </OptionItem>
                )
            })}

        <OptionItem v-show={isNotNone.value} label={msg => msg.option.backup.client}>
            <ElInput
                modelValue={clientName.value}
                size="small"
                style={{ width: "120px" }}
                placeholder={DEFAULT.clientName}
                onInput={val => clientName.value = val?.trim?.() || ''}
            />
        </OptionItem>
        <Footer v-show={isNotNone.value} type={backupType.value} />
    </>
})

export default _default