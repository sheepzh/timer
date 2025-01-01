/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Delete } from "@element-plus/icons-vue"
import { useShadow } from "@hooks"
import { ElDivider, ElLink, ElMessage, ElScrollbar, ElText, type ScrollbarInstance } from "element-plus"
import { type PropType, defineComponent, ref, watch } from "vue"
import { type StepFromInstance } from "../common"
import UrlInput from "./UrlInput"
import "./style.sass"

const _default = defineComponent({
    props: {
        defaultValue: {
            type: Object as PropType<string[]>,
            required: true,
        },
    },
    emits: {
        change: (_urls: string[]) => true,
    },
    setup(props, ctx) {
        const [urls, setUrls] = useShadow(() => props.defaultValue)
        watch(urls, () => ctx.emit('change', urls.value))
        const scrollbar = ref<ScrollbarInstance>()

        const validate = () => {
            if (!urls.value?.length) {
                ElMessage.error(t(msg => msg.limit.message.noUrl))
                return false
            }
            return true
        }
        ctx.expose({ validate } satisfies StepFromInstance)

        const handleSave = (url: string) => {
            setUrls([url, ...urls.value || []])
            scrollbar.value?.scrollTo(0)
        }

        return () => <div class="limit-step2">
            <UrlInput onSave={handleSave} />
            <ElDivider />
            <ElScrollbar maxHeight={320} ref={scrollbar}>
                {urls.value?.map((url, idx, arr) => <div class="url-list-item">
                    <ElText type="primary">{url}</ElText>
                    <ElLink
                        icon={<Delete />}
                        type="danger"
                        onClick={() => setUrls(arr.filter((_, i) => i !== idx))}
                    />
                </div>)}
                <div class="url-empty-desc" v-show={!urls.value?.length}>
                    <ElText>
                        {t(msg => msg.limit.message.noUrl)}
                    </ElText>
                </div>
            </ElScrollbar>
        </div>
    }
})

export default _default
