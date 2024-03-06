/**
 * Copyright (c) 2021-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, PropType, ref, Ref, watch } from "vue"
import { t } from "@app/locale"
import { ElButton, ElFormItem, ElInput, ElMessage, ElOption, ElSelect } from "element-plus"
import { parseUrl, Protocol } from "./common"
import { Cpu, Refresh } from "@element-plus/icons-vue"

const ALL_PROTOCOLS: Protocol[] = ['http://', 'https://', '*://']

function cleanUrl(url: string): string {
    if (!url) return url

    const querySign = url.indexOf('?')
    querySign > -1 && (url = url.substring(0, querySign))
    const hashSign = url.indexOf('#')
    hashSign > -1 && (url = url.substring(0, hashSign))
    return url
}

const _default = defineComponent({
    emits: {
        urlChange: (_val: string) => true,
        protocolChange: (_val: Protocol) => true,
    },
    props: {
        url: String,
        protocol: String as PropType<Protocol>,
        disabled: {
            type: Boolean,
            defaultValue: false,
        }
    },
    setup(props, ctx) {
        // protocol
        const protocol: Ref<Protocol> = ref(props.protocol)
        watch(() => props.protocol, () => protocol.value = props.protocol)
        watch(protocol, () => ctx.emit('protocolChange', protocol.value))
        // url
        const url: Ref<string> = ref(props.url)
        watch(url, () => ctx.emit('urlChange', url.value))
        watch(() => props.url, () => {
            url.value = props.url
            editing.value = !url.value
        })
        const editing = ref(props.disabled ? false : !url.value)
        watch(() => props.disabled, () => editing.value = !props.disabled)
        const inputVal = ref<string>()

        const handleParse = () => {
            const originUrl = inputVal.value?.trim?.()
            if (!originUrl) return ElMessage.warning(t(msg => msg.limit.message.noUrl))
            const urlInfo = parseUrl(originUrl)
            protocol.value = urlInfo.protocol
            url.value = cleanUrl(urlInfo.url)
            editing.value = false
            inputVal.value = ''
        }

        const handleReInput = () => {
            url.value = ''
            editing.value = true
        }

        return () => <ElFormItem label={t(msg => msg.limit.item.condition)} required>
            {
                editing.value
                    ? <ElInput
                        modelValue={inputVal.value}
                        onInput={val => inputVal.value = val}
                        clearable
                        onClear={() => inputVal.value = ''}
                        onKeydown={(e: KeyboardEvent) => e.code === "Enter" && handleParse()}
                        v-slots={{
                            append: () => <ElButton icon={<Cpu />} onClick={handleParse}>
                                {t(msg => msg.limit.button.parseUrl)}
                            </ElButton>
                        }}
                        placeholder={t(msg => msg.limit.urlPlaceholder)}
                    />
                    : <ElInput
                        disabled={props.disabled}
                        modelValue={url.value}
                        onInput={() => {/* Do Nothing */ }}
                        class="limit-time-url-input"
                        v-slots={{
                            prefix: () => <ElSelect
                                modelValue={protocol.value}
                                onChange={(val: string) => protocol.value = val as Protocol}
                                disabled={props.disabled}
                                style={{ width: "90%" }}
                            >
                                {ALL_PROTOCOLS.map(p => <ElOption value={p} label={p} />)}
                            </ElSelect>,
                            append: () => <ElButton
                                icon={<Refresh />}
                                disabled={props.disabled}
                                onClick={handleReInput}
                            >
                                {t(msg => msg.limit.button.reEnterUrl)}
                            </ElButton>
                        }}
                    />

            }
        </ElFormItem>
    }
})

export default _default