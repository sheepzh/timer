/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Close, Right } from "@element-plus/icons-vue"
import { ElButton, ElForm, ElMessage } from "element-plus"
import { Ref, defineComponent, ref, watch } from "vue"
import { Protocol, parseUrl } from "./common"
import LimitUrlFormItem from "./url"
import LimitPathEdit, { PathEditInstance } from "./LimitPathEdit"

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
    setup(props, ctx) {
        const { protocol: defaultProtocol, url: defaultUrl } = parseUrl(props.defaultValue)
        const protocol: Ref<Protocol> = ref(defaultProtocol)
        const pathEdit: Ref<PathEditInstance> = ref()
        const url: Ref<string> = ref(defaultUrl)

        watch(() => props.defaultValue, () => {
            const { protocol: newProtocol, url: newUrl } = parseUrl(props.defaultValue)
            protocol.value = newProtocol
            url.value = newUrl
        })

        const handleNext = () => {
            let cond = props.defaultValue
            if (!props.disabled) {
                const urlVal = url.value?.trim?.()
                if (!urlVal) {
                    return ElMessage.error(t(msg => msg.limit.message.noUrl))
                }
                cond = urlVal ? protocol.value + urlVal : ''
            }
            ctx.emit("next", cond)
        }

        return () => <>
            <ElForm labelWidth={180} labelPosition="left">
                <LimitUrlFormItem
                    url={url.value}
                    protocol={protocol.value}
                    disabled={props.disabled}
                    onUrlChange={val => {
                        url.value = val
                        pathEdit.value?.updateUrl?.(val)
                    }}
                    onProtocolChange={val => protocol.value = val}
                />
            </ElForm>
            <LimitPathEdit
                v-show={!props.disabled}
                ref={pathEdit}
                url={url.value}
                onUrlChange={val => url.value = val}
            />
            <div class="sop-footer">
                <ElButton type="info" icon={<Close />} onClick={() => ctx.emit("cancel")}>
                    {t(msg => msg.button.cancel)}
                </ElButton>
                <ElButton
                    type="primary"
                    icon={<Right />}
                    onClick={handleNext}
                >
                    {t(msg => msg.button.next)}
                </ElButton>
            </div>
        </>
    }
})

export default _default
