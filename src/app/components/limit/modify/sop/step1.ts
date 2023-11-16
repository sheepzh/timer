/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Close, Right } from "@element-plus/icons-vue"
import { ElButton, ElForm, ElMessage } from "element-plus"
import { Ref, defineComponent, h, ref, watch } from "vue"
import { Protocol, parseUrl } from "./common"
import LimitUrlFormItem from "./url"
import LimitPathEdit, { PathEditInstance } from "./path-edit"

const _default = defineComponent({
    props: {
        defaultValue: {
            type: String,
            required: true,
        },
        disabled: Boolean,
    },
    emits: {
        cancel: () => true,
        next: (_cond: string) => true,
    },
    setup({ disabled, defaultValue }, ctx) {
        const { protocol, url } = parseUrl(defaultValue)
        const protocalRef: Ref<Protocol> = ref(protocol)
        const pathEditRef: Ref<PathEditInstance> = ref()
        const urlRef: Ref<string> = ref(url)

        watch(() => defaultValue, () => {
            const { protocol, url } = parseUrl(defaultValue)
            protocalRef.value = protocol
            urlRef.value = url
        })

        const handleNext = () => {
            let cond = defaultValue
            if (!disabled) {
                const url = urlRef.value?.trim?.()
                if (!url) {
                    return ElMessage.error(t(msg => msg.limit.message.noUrl))
                }
                const protocol = protocalRef.value
                cond = url ? protocol + url : ''
            }
            ctx.emit("next", cond)
        }

        return () => {
            const items = [
                h(ElForm,
                    { labelWidth: 180, labelPosition: "left" },
                    () => h(LimitUrlFormItem, {
                        url: urlRef.value,
                        protocol: protocalRef.value,
                        disabled: disabled,
                        onUrlChange: (newUrl: string) => {
                            urlRef.value = newUrl
                            pathEditRef.value?.updateUrl?.(newUrl)
                        },
                        onProtocolChange: (newProtocol: Protocol) => protocalRef.value = newProtocol,
                    }),
                ),
            ]

            !disabled && items.push(h(LimitPathEdit, {
                ref: pathEditRef,
                url: urlRef.value,
                onUrlChange: (newVal: string) => urlRef.value = newVal
            }))
            items.push(
                h('div', { class: 'sop-footer' }, [
                    h(ElButton, {
                        type: 'info',
                        icon: Close,
                        onClick: () => ctx.emit('cancel'),
                    }, () => t(msg => msg.button.cancel)),
                    h(ElButton, {
                        type: 'primary',
                        icon: Right,
                        onClick: handleNext,
                    }, () => t(msg => msg.button.next)),
                ])
            )
            return items
        }
    }
})

export default _default
