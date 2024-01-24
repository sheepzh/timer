/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElSwitch, ElTag, ElTooltip } from "element-plus"
import { defineComponent, PropType, reactive, ref, StyleValue, VNode, watch } from "vue"
import { t } from "@app/locale"
import { UrlPart } from "./common"

const switchStyle: StyleValue = { marginRight: '2px' }

const tabStyle: StyleValue = {
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
        return () => (
            <ElTag type="info" closable onClose={() => ctx.emit("close")} style={tabStyle}>
                <ElTooltip content={t(msg => msg.limit.useWildcard)}>
                    <ElSwitch
                        style={switchStyle}
                        modelValue={myIgnored.value}
                        onChange={val => myIgnored.value = !!val}
                    />
                </ElTooltip>
                <span>{origin}</span>
            </ElTag>
        )
    }
})

const combineStyle: StyleValue = {
    fontSize: '14px',
    margin: '0 2px',
    ...tabStyle
}

const combineTags = (arr: VNode[], current: VNode) => {
    arr.length && arr.push(<span style={combineStyle}>/</span>)
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

        return () => (
            <div>
                {
                    items.map((item, idx, arr) => idx
                        ? <ItemTag part={item} onClose={() => arr.splice(idx)} onChange={p => arr[idx] = p} />
                        : <ElTag style={tabStyle}> <span>{item.origin}</span> </ElTag>
                    ).reduce(combineTags, [])
                }
            </div>
        )
    }
})

export default _default