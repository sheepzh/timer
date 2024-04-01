/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { IS_SAFARI } from "@util/constant/environment"
import { ElLink } from "element-plus"
import { computed, defineComponent, StyleValue } from "vue"

const HOST_ICON_STYLE: StyleValue = {
    height: "23px",
    lineHeight: "23px",
    paddingLeft: "2px"
}

const _default = defineComponent({
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
        const href = computed(() => props.clickable ? `http://${props.host}` : '')
        const target = computed(() => props.clickable ? '_blank' : '')
        const cursor = computed(() => props.clickable ? "cursor" : "default")
        return () => IS_SAFARI
            ? <ElLink href={href.value} target={target.value} underline={props.clickable} style={{ cursor: cursor.value }}>
                {props.host}
            </ElLink>
            : <div>
                <ElLink href={href.value} target={target.value} underline={props.clickable} style={{ cursor: cursor.value }}>
                    {props.host}
                </ElLink>
                {props.iconUrl &&
                    <span style={HOST_ICON_STYLE}>
                        <img src={props.iconUrl} width={12} height={12} />
                    </span>
                }
            </div>
    }
})

export default _default