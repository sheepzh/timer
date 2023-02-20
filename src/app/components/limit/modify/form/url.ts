/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h, PropType, ref, Ref, VNode, watch } from "vue"
import clipboardy from "clipboardy"
import { t } from "@app/locale"
import { ElButton, ElFormItem, ElInput, ElOption, ElSelect } from "element-plus"
import { checkPermission, requestPermission } from "@api/chrome/permissions"
import { IS_FIREFOX } from "@util/constant/environment"
import { parseUrl } from "./common"

const ALL_PROTOCOLS: Protocol[] = ['http://', 'https://', '*://']

export function computeUrl(pathItems: UrlPart[]): string {
    return pathItems.map(i => i.ignored ? '*' : i.origin || '').join('/')
}

const protocolOptions = () => ALL_PROTOCOLS.map(prefix => h(ElOption, { value: prefix, label: prefix }))

function cleanUrl(url: string): string {
    if (!url) {
        return ''
    }
    const querySign = url.indexOf('?')
    querySign > -1 && (url = url.substring(0, querySign))
    const hashSign = url.indexOf('#')
    hashSign > -1 && (url = url.substring(0, hashSign))
    return url
}

const PERMISSION = 'clipboardRead'
const FIREFOX_NO_PERMISSION_MSG = t(msg => msg.limit.message.noPermissionFirefox)

type _Slot = () => VNode
type _Slots = { prefix: _Slot, append?: _Slot }

function slots(protocolRef: Ref<Protocol>, urlRef: Ref<string>, disabled: boolean): _Slots {
    const slots: _Slots = {
        prefix: () => h(ElSelect, {
            modelValue: protocolRef.value,
            onChange: (val: string) => protocolRef.value = val as Protocol,
            disabled: disabled,
        }, protocolOptions),
    }
    !disabled && (slots.append = () => h(ElButton, {
        onClick: () => handlePaste(
            url => urlRef.value = url,
            prot => protocolRef.value = prot
        )
    }, () => pasteButtonText))
    return slots
}

async function handlePaste(urlHandler: (newUrl: string) => void, protocolHandler: (newProtocol: Protocol) => void) {
    let granted = await checkPermission(PERMISSION)

    if (!granted) {
        if (IS_FIREFOX) {
            // Can't request permission here in Firefox
            // The reason maybe is @see https://stackoverflow.com/a/47729896
            // GG, Firefox
            alert(FIREFOX_NO_PERMISSION_MSG)
            return
        } else {
            granted = await requestPermission(PERMISSION)
        }
    }

    if (!granted) {
        alert('Can\'t read the clipboard, please contact the developer via email to returnzhy1996@outlook.com')
        return
    }

    let fullUrl = await clipboardy.read()
    const { protocol, url } = parseUrl(fullUrl)
    protocolHandler?.(protocol)
    urlHandler?.(cleanUrl(url))
}

const pasteButtonText = t(msg => msg.limit.button.paste)
const placeholder = t(msg => msg.limit.urlPlaceholder)

const _default = defineComponent({
    name: 'LimitUrlFormItem',
    emits: {
        urlChange: (_val: string) => true,
        protocolChange: (_val: Protocol) => true,
    },
    props: {
        url: String,
        protocol: String as PropType<Protocol>,
        disabled: {
            type: Boolean,
            defaultValue: false
        }
    },
    setup(props, ctx) {
        // protocol
        const protocolRef: Ref<Protocol> = ref(props.protocol)
        watch(() => props.protocol, () => protocolRef.value = props.protocol)
        watch(protocolRef, () => ctx.emit('protocolChange', protocolRef.value))
        // url
        const urlRef: Ref<string> = ref(props.url)
        watch(urlRef, () => ctx.emit('urlChange', urlRef.value))
        watch(() => props.url, () => urlRef.value = props.url)

        return () => h(ElFormItem, { label: t(msg => msg.limit.item.condition) },
            () => {
                const slots_: _Slots = slots(protocolRef, urlRef, props.disabled)
                return h(ElInput, {
                    modelValue: urlRef.value,
                    clearable: !props.disabled,
                    disabled: props.disabled,
                    onClear() {
                        urlRef.value = ''
                        ctx.emit('urlChange', '')
                    },
                    // Disabled this input in the css to customized the styles
                    // @see ../style/el-input.sass
                    // @see this.onInput
                    // disabled: true,
                    onInput: (_val: string) => { /** Do nothing */ },
                    placeholder
                }, slots_)
            }
        )
    }
})

export default _default