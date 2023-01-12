/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElSwitch, ElTag, ElTooltip } from "element-plus"
import { defineComponent, h, ref, Ref, VNode } from "vue"
import { t } from "@app/locale"

const switchStyle: Partial<CSSStyleDeclaration> = { marginRight: '2px' }

const tagContent = (item: UrlPart, index: number, callback: Function) => {
    const result: VNode[] = []
    if (!!index) {
        const modelValue = item.ignored
        const onChange = (val: boolean) => {
            item.ignored = val
            callback?.()
        }
        const switchNode = h(ElSwitch, { style: switchStyle, modelValue, onChange })

        const tooltipNode = h(ElTooltip, { content: t(msg => msg.limit.useWildcard) }, { default: () => switchNode })
        result.push(tooltipNode)
    }
    result.push(h('span', {}, item.origin))
    return result
}

const tabStyle: Partial<CSSStyleDeclaration> = {
    marginBottom: '5px',
    marginRight: '0',
}

const item2Tag = (item: UrlPart, index: number, arr: UrlPart[], onChange: Function) => {
    const isNotHost: boolean = !!index
    return h(ElTag, {
        type: isNotHost ? '' : 'info',
        closable: isNotHost,
        onClose: () => {
            arr.splice(index)
            onChange?.()
        },
        style: tabStyle
    }, () => tagContent(item, index, onChange))
}
const combineStyle = {
    fontSize: '14px',
    margin: '0 2px',
    ...tabStyle
}
const combineTags = (arr: VNode[], current: VNode) => {
    arr.length && arr.push(h('span', { style: combineStyle }, '/'))
    arr.push(current)
    return arr
}

function url2PathItems(url: string): UrlPart[] {
    return url.split('/').filter(path => path).map(path => ({ origin: path, ignored: path === '*' }))
}

function pathItems2Url(pathItems: UrlPart[]): string {
    return pathItems.map(i => i.ignored ? '*' : i.origin || '').join('/')
}

const _default = defineComponent({
    name: 'LimitPathEdit',
    props: {
        url: {
            type: String,
            required: false,
            defaultValue: ''
        },
    },
    emits: {
        urlChange: (_url: string) => true
    },
    setup(props, ctx) {
        const url = props.url
        const items: Ref<UrlPart[]> = ref(url2PathItems(url))
        ctx.expose({
            forceUpdateUrl(url: string) {
                items.value = url2PathItems(url)
            }
        })
        const handleUrlChange = () => ctx.emit('urlChange', pathItems2Url(items.value))
        return () => h('div', {}, items.value
            .map((item, index, arr) => item2Tag(item, index, arr, handleUrlChange))
            .reduce(combineTags, [])
        )
    }
})

export default _default