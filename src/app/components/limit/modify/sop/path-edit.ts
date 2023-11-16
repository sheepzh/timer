/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElSwitch, ElTag, ElTooltip } from "element-plus"
import { defineComponent, h, PropType, reactive, ref, VNode, watch } from "vue"
import { t } from "@app/locale"
import { UrlPart } from "./common"

const switchStyle: Partial<CSSStyleDeclaration> = { marginRight: '2px' }

const tabStyle: Partial<CSSStyleDeclaration> = {
    marginBottom: '5px',
    marginRight: '0',
}

const ItemTag = defineComponent({
    props: {
        part: Object as PropType<UrlPart>,
    },
    emits: {
        close: () => true,
        change: (_p: UrlPart) => true,
    },
    setup({ part: { origin, ignored } = { origin: "", ignored: false } }, ctx) {
        const myIgnored = ref(ignored)

        watch(myIgnored, () => ctx.emit("change", { ignored: myIgnored.value, origin }))

        return () => h(ElTag, {
            type: 'info',
            closable: true,
            onClose: () => ctx.emit("close"),
            style: tabStyle
        }, () => [
            h(ElTooltip, {
                content: t(msg => msg.limit.useWildcard)
            }, {
                default: () => h(ElSwitch, {
                    style: switchStyle,
                    modelValue: myIgnored.value,
                    onChange: (newVal: boolean) => myIgnored.value = newVal
                })
            }),
            h('span', {}, origin),
        ])
    }
})

const item2Tag = (item: UrlPart, index: number, arr: UrlPart[]) => {
    const isNotHost: boolean = !!index
    return isNotHost
        ? h(ItemTag, { part: item, onClose: () => arr.splice(index), onChange: p => arr[index] = p })
        : h(ElTag, { style: tabStyle }, () => h('span', item.origin))
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

export type PathEditInstance = {
    updateUrl: (url: string) => void
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
    setup({ url }, ctx) {
        const items = reactive(url2PathItems(url))
        watch(items, () => ctx.emit('urlChange', pathItems2Url(items)))

        const instance: PathEditInstance = {
            updateUrl: url => {
                items.splice(0, items.length)
                const newItems = url2PathItems(url)
                items.push(...newItems)
            }
        }

        ctx.expose(instance)

        return () => h('div', {}, items
            .map((item, index, arr) => item2Tag(item, index, arr))
            .reduce(combineTags, [])
        )
    }
})

export default _default