import { t } from "@app/locale"
import { Check, Close, Cpu } from "@element-plus/icons-vue"
import { useState, useSwitch } from "@hooks"
import Flex from "@pages/components/Flex"
import { ElButton, ElInput, ElLink, ElMessage, ElOption, ElSelect, ElSwitch, ElTag, ElTooltip } from "element-plus"
import { defineComponent, reactive, type StyleValue, toRaw, toRefs, type VNode } from "vue"
import { parseUrl, Protocol, type UrlPart } from "../common"

const ALL_PROTOCOLS: Protocol[] = ['http://', 'https://', '*://']

const combineTags = (arr: VNode[], current: VNode) => {
    arr.length && arr.push(<span>/</span>)
    arr.push(current)
    return arr
}

const Part = defineComponent({
    props: {
        first: Boolean,
        origin: String,
        ignored: Boolean,
    },
    emits: {
        ignoredChange: (_val: boolean) => true,
        delete: () => true,
    },
    setup(props, ctx) {
        const tagStyle: StyleValue = { height: '32px' }
        const { origin, first, ignored } = toRefs(props)
        return () => first.value
            ? (
                <ElTag style={tagStyle}>
                    <span>{origin.value}</span>
                </ElTag>
            ) : (
                <ElTag
                    type="info"
                    closable
                    onClose={() => ctx.emit('delete')}
                    style={tagStyle}
                >
                    <Flex gap={2} align="center">
                        <ElTooltip content={t(msg => msg.limit.useWildcard)}>
                            <ElSwitch
                                size="small"
                                modelValue={ignored.value}
                                onChange={val => ctx.emit('ignoredChange', val as boolean)}
                            />
                        </ElTooltip>
                        <span>{ignored.value ? '*' : origin.value}</span>
                    </Flex>
                </ElTag>
            )
    }
})

const _default = defineComponent({
    emits: {
        save: (_url: string) => true
    },
    setup(_, ctx) {
        const [editing, openEditing, closeEditing] = useSwitch()
        const [inputVal, setInputVal, resetInputVal] = useState<string>()
        const parts: UrlPart[] = reactive([])
        const [protocol, setProtocol] = useState<Protocol>("*://")

        const handleParse = () => {
            const originUrl = inputVal.value?.trim?.()
            if (!originUrl) return ElMessage.warning("URL is blank")
            const { protocol, parts: newParts } = parseUrl(originUrl)

            setProtocol(protocol)
            parts.splice(0, parts.length)
            parts.push(...newParts || [])
            openEditing()
        }

        const handleSave = () => {
            const url = protocol.value + parts?.map(part => {
                const { origin, ignored } = toRaw(part)
                return ignored ? '*' : origin
            })?.join('/') || '-'
            ctx.emit("save", url)
            reset()
        }

        const reset = () => {
            closeEditing()
            resetInputVal()
        }

        return () => (
            <Flex style={{ padding: '0 20px' }}>
                <ElInput
                    v-show={!editing.value}
                    modelValue={inputVal.value}
                    onInput={setInputVal}
                    clearable
                    onClear={resetInputVal}
                    onKeydown={ev => (ev as KeyboardEvent)?.code === "Enter" && handleParse()}
                    v-slots={{
                        append: () => (
                            <ElButton icon={<Cpu />} onClick={handleParse}>
                                {t(msg => msg.limit.button.parseUrl)}
                            </ElButton>
                        )
                    }}
                    placeholder={t(msg => msg.limit.urlPlaceholder)}
                />
                <Flex v-show={editing.value} width="100%" column gap={20}>
                    <Flex width="100%" wrap="wrap" align="center" gap={5}>
                        <ElSelect modelValue={protocol.value} onChange={setProtocol} style={{ width: '90px' }}>
                            {ALL_PROTOCOLS.map(p => <ElOption value={p} label={p} />)}
                        </ElSelect>
                        {parts?.map((item, idx) => (
                            <Part
                                origin={item.origin}
                                first={!idx}
                                ignored={item.ignored}
                                onDelete={() => parts.splice(idx, parts.length - idx)}
                                onIgnoredChange={newVal => item.ignored = newVal}
                            />
                        )).reduce(combineTags, [])}
                    </Flex>
                    <Flex gap={10}>
                        <ElLink icon={<Close />} onClick={reset}>
                            {t(msg => msg.button.cancel)}
                        </ElLink>
                        <ElLink icon={<Check />} onClick={handleSave} type="primary">
                            {t(msg => msg.button.save)}
                        </ElLink>
                    </Flex>
                </Flex>
            </Flex >
        )
    }
})

export default _default
