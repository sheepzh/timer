/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { h, Ref } from "vue"
import clipboardy from "clipboardy"
import { t } from "@app/locale"
import { ElButton, ElFormItem, ElInput, ElOption, ElSelect } from "element-plus"
import UrlPathItem from "./url-path-item"
import { checkOrRequestPermission } from "@src/permissions"

export enum Protocol {
    HTTP = 'http://',
    HTTPS = 'https://',
    ALL = '*://'
}

type _Props = {
    protocolRef: Ref<string>
    pathItemsRef: Ref<UrlPathItem[]>
    urlRef: Ref<string>
}

export type FormUrlProps = _Props

const protocolOptions = () => Object.entries(Protocol)
    .map(([_name, value]) => value)
    .map(prefix => h(ElOption, { value: prefix, label: prefix }))

const protocolSelect = (protocolRef: Ref<string>) => h(ElSelect, {
    modelValue: protocolRef.value,
    onChange: (val: string) => protocolRef.value = val
}, protocolOptions)

const url2PathItems = (url: string) => {
    const querySign = url.indexOf('?')
    querySign > -1 && (url = url.substr(0, querySign))
    const hashSign = url.indexOf('#')
    hashSign > -1 && (url = url.substr(0, hashSign))
    return url.split('/').filter(path => path).map(path => UrlPathItem.of(path))
}

const PERMISSION = 'clipboardRead'

const handlePaste = async (protocolRef: Ref<string>, pathItemsRef: Ref<UrlPathItem[]>) => {
    const granted = await checkOrRequestPermission(PERMISSION)

    if (!granted) {
        alert('Can\'t read the clipboard, please contact the developer via email to returnzhy1996@outlook.com')
        return
    }

    let url = await clipboardy.read(), protocol = Protocol.ALL

    url = decodeURI(url)
    if (url.startsWith(Protocol.HTTP)) {
        protocol = Protocol.HTTP
        url = url.substr(Protocol.HTTP.length)
    } else if (url.startsWith(Protocol.HTTPS)) {
        protocol = Protocol.HTTPS
        url = url.substr(Protocol.HTTPS.length)
    }
    protocolRef.value = protocol
    pathItemsRef.value = url2PathItems(url)
}
const pasteButtonText = t(msg => msg.limit.button.paste)
const urlPaste = (protocolRef: Ref<string>, pathItemsRef: Ref<UrlPathItem[]>) => h<{}>(ElButton,
    {
        onClick: () => handlePaste(protocolRef, pathItemsRef)
    },
    () => pasteButtonText
)

const urlInput = ({ protocolRef, urlRef, pathItemsRef }: _Props) => h(ElInput,
    {
        modelValue: urlRef.value,
        clearable: true,
        onClear: () => pathItemsRef.value = [],
        // Disabled this input in the css to customized the styles
        // @see ../style/el-input.sass
        // @see this.onInput
        // disabled: true,
        onInput: (_val: string) => { /** Do nothing */ }
    },
    {
        prefix: () => protocolSelect(protocolRef),
        append: () => urlPaste(protocolRef, pathItemsRef)
    }
)
const urlFormItem = (props: _Props) => h(ElFormItem, { label: t(msg => msg.limit.item.condition) }, () => urlInput(props))

export default urlFormItem