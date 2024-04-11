import { defineComponent, VNode } from "vue"
import { parseUrl, Protocol, UrlPart } from "../common"
import { useState, useSwitch } from "@hooks"
import { ElButton, ElInput, ElLink, ElMessage, ElOption, ElSelect, ElSwitch, ElTag, ElTooltip } from "element-plus"
import { t } from "@app/locale"
import { Check, Close, Cpu } from "@element-plus/icons-vue"

const ALL_PROTOCOLS: Protocol[] = ['http://', 'https://', '*://']

const combineTags = (arr: VNode[], current: VNode) => {
    arr.length && arr.push(<span class="part-separator">/</span>)
    arr.push(current)
    return arr
}

const _default = defineComponent({
    emits: {
        save: (_url: string) => true
    },
    setup(_, ctx) {
        const [editing, openEditing, closeEditing] = useSwitch()
        const [inputVal, setInputVal, resetInputVal] = useState<string>()
        const [parts, setParts] = useState<UrlPart[]>([])
        const [protocol, setProtocol] = useState<Protocol>("*://")

        const handleParse = () => {
            const originUrl = inputVal.value?.trim?.()
            if (!originUrl) return ElMessage.warning("URL is blank")
            const { protocol, parts } = parseUrl(originUrl)

            setProtocol(protocol)
            setParts(parts)
            openEditing()
        }

        const handleSave = () => {
            const url = protocol.value + parts.value?.map(({ origin, ignored }) => ignored ? '*' : origin)?.join('/') ?? '-'
            ctx.emit("save", url)
            reset()
        }

        const reset = () => {
            closeEditing()
            resetInputVal()
        }

        return () => <div class="url-input">
            <ElInput
                v-show={!editing.value}
                modelValue={inputVal.value}
                onInput={setInputVal}
                clearable
                onClear={resetInputVal}
                onKeydown={(e: KeyboardEvent) => e.code === "Enter" && handleParse()}
                v-slots={{
                    append: () => <>
                        <ElButton icon={<Cpu />} onClick={handleParse}>
                            {t(msg => msg.limit.button.parseUrl)}
                        </ElButton>
                    </>
                }}
                placeholder={t(msg => msg.limit.urlPlaceholder)}
            />
            <div class="url-editing-container" v-show={editing.value}>
                <div class="url-part-container">
                    <ElSelect modelValue={protocol.value} onChange={(val: Protocol) => setProtocol(val)}>
                        {ALL_PROTOCOLS.map(p => <ElOption value={p} label={p} />)}
                    </ElSelect>
                    {parts.value?.map((item, idx, arr) => idx
                        ? <ElTag type="info"
                            closable
                            onClose={() => setParts(arr.filter((_, i) => i < idx))}
                        >
                            <ElTooltip content={t(msg => msg.limit.useWildcard)}>
                                <ElSwitch
                                    style={{ marginRight: '2px' }}
                                    modelValue={item.ignored}
                                    onChange={(val: boolean) => {
                                        item.ignored = val
                                        setParts([...arr])
                                    }}
                                />
                            </ElTooltip>
                            <span>{item.ignored ? '*' : item.origin}</span>
                        </ElTag>
                        : <ElTag class="domain-part">
                            <span>{item.origin}</span>
                        </ElTag>
                    ).reduce(combineTags, [])}
                </div>
                <div class="url-part-button">
                    <ElLink icon={<Close />} onClick={reset}>
                        {t(msg => msg.button.cancel)}
                    </ElLink>
                    <ElLink icon={<Check />} onClick={handleSave} type="primary">
                        {t(msg => msg.button.save)}
                    </ElLink>
                </div>
            </div>
        </div>
    }
})

export default _default
