/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import Flex from "@pages/components/Flex"
import { IS_SAFARI } from "@util/constant/environment"
import { isRemainHost } from "@util/constant/remain-host"
import { ElLink } from "element-plus"
import { computed, defineComponent, type PropType } from "vue"

const _default = defineComponent({
    props: {
        value: {
            type: Object as PropType<timer.site.SiteKey>,
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
        const clickable = computed(() => {
            if (!props.clickable) return false
            const { host, type } = props.value || {}
            return type === 'normal' && !isRemainHost(host)
        })
        const href = computed(() => clickable.value ? `http://${props.value.host}` : '')
        const target = computed(() => clickable.value ? '_blank' : '')
        const cursor = computed(() => clickable.value ? "cursor" : "default")
        return () => <div style={{ wordBreak: "break-all" }}>
            {IS_SAFARI ? (
                <ElLink
                    href={href.value}
                    target={target.value}
                    underline={clickable.value}
                    style={{ cursor: cursor.value }}
                >
                    {props.value?.host}
                </ElLink>
            ) : (
                <Flex justify="center" align="center" gap={3} >
                    <ElLink href={href.value} target={target.value} underline={clickable.value} style={{ cursor: cursor.value }}>
                        {props.value?.host}
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