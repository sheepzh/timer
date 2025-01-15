/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Delete } from "@element-plus/icons-vue"
import Flex from "@pages/components/Flex"
import { ElDivider, ElLink, ElMessage, ElScrollbar, ElText, type ScrollbarInstance } from "element-plus"
import { type PropType, defineComponent, reactive, ref, toRaw, watch } from "vue"
import { type StepFromInstance } from "../common"
import UrlInput from "./UrlInput"

const _default = defineComponent({
    props: {
        modelValue: {
            type: Object as PropType<string[]>,
            required: true,
        },
    },
    emits: {
        change: (_urls: string[]) => true,
    },
    setup(props, ctx) {
        const urls = reactive(props.modelValue)

        watch(() => props.modelValue, () => {
            urls.splice(0, urls.length)
            props.modelValue?.forEach(v => urls.push(v))
        })

        const emitChange = () => ctx.emit('change', toRaw(urls))
        const scrollbar = ref<ScrollbarInstance>()

        const validate = () => {
            if (!urls?.length) {
                ElMessage.error(t(msg => msg.limit.message.noUrl))
                return false
            }
            return true
        }
        ctx.expose({ validate } satisfies StepFromInstance)

        const handleSave = (url: string) => {
            urls.unshift(url)
            scrollbar.value?.scrollTo(0)
            emitChange()
        }

        const handleRemove = (idx: number) => {
            urls.splice(idx, 1)
            emitChange()
        }

        return () => (
            <Flex column width="100%">
                <UrlInput onSave={handleSave} />
                <ElDivider />
                <ElScrollbar maxHeight={320} ref={scrollbar}>
                    <Flex column width="100%" gap={10}>
                        {urls?.map((url, idx) => (
                            <Flex
                                key={url}
                                height={50}
                                align="center"
                                justify="space-between"
                                padding='0 20px'
                                style={{ backgroundColor: 'var(--el-fill-color)' }}
                            >
                                <ElText type="primary">{url}</ElText>
                                <ElLink
                                    icon={<Delete />}
                                    type="danger"
                                    onClick={() => handleRemove(idx)}
                                />
                            </Flex>
                        ))}
                    </Flex>
                    <div v-show={!urls?.length} style={{ textAlign: 'center' }}>
                        <ElText>
                            {t(msg => msg.limit.message.noUrl)}
                        </ElText>
                    </div>
                </ElScrollbar>
            </Flex>
        )
    }
})

export default _default
