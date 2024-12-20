/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { IS_SAFARI } from "@util/constant/environment"
import { ElLink } from "element-plus"
import { computed, defineComponent } from "vue"
import Flex from "./Flex"

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
        return () => <div style={{ wordBreak: "break-all" }}>
            {IS_SAFARI ? (
                <ElLink
                    href={href.value}
                    target={target.value}
                    underline={props.clickable}
                    style={{ cursor: cursor.value }}
                >
                    {props.host}
                </ElLink>
            ) : (
                <Flex align="center" gap={3}>
                    <ElLink href={href.value} target={target.value} underline={props.clickable} style={{ cursor: cursor.value }}>
                        {props.host}
                    </ElLink>
                    {props.iconUrl &&
                        <Flex align="center">
                            <img src={props.iconUrl} width={12} height={12} />
                        </Flex>
                    }
                </Flex>
            )}
        </div >
    }
})

export default _default