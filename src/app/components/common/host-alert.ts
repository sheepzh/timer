/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { IS_SAFARI } from "@util/constant/environment"
import { ElLink } from "element-plus"
import { computed, ComputedRef, defineComponent, h } from "vue"

const HOST_ICON_STYLE: Partial<CSSStyleDeclaration> = {
    height: "23px",
    lineHeight: "23px",
    paddingLeft: "2px"
}

const _default = defineComponent({
    name: "HostAlert",
    props: {
        host: {
            type: String,
            required: true
        },
        iconUrl: {
            type: String,
            required: false
        },
        /**
         * Whether to jump towards {@param host} if users click this component
         * 
         * @since 0.7.1
         */
        clickable: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {
        const href: ComputedRef<string> = computed(() => props.clickable ? `http://${props.host}` : '')
        const target: ComputedRef<string> = computed(() => props.clickable ? '_blank' : '')
        const cursor: ComputedRef<string> = computed(() => props.clickable ? "cursor" : "default")
        return IS_SAFARI
            ? () => h(ElLink, {
                href: href.value,
                target: target.value,
                underline: props.clickable,
                style: { cursor: cursor.value }
            }, () => props.host)
            : () => h('div', [
                h(ElLink,
                    {
                        href: href.value,
                        target: target.value,
                        underline: props.clickable,
                        style: { cursor: cursor.value }
                    },
                    () => props.host
                ), h('span',
                    { style: HOST_ICON_STYLE },
                    h('img', { src: props.iconUrl, width: 12, height: 12 })
                )
            ])
    }
})

export default _default