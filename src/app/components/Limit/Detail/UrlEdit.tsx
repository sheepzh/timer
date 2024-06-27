import { Cpu, Close, Check } from "@element-plus/icons-vue"
import { useSwitch, useState } from "@hooks"
import { t } from "@app/locale"
import { ElMessage, ElInput, ElButton, ElSelect, ElOption, ElTag, ElTooltip, ElSwitch, ElLink, ElAlert } from "element-plus"
import { VNode, computed, defineComponent } from "vue"
import { Protocol, UrlPart, parseUrl } from "../LimitModify/Sop/common"

const ALL_PROTOCOLS: Protocol[] = ['http://', 'https://', '*://']

const combineTags = (arr: VNode[], current: VNode) => {
    arr.length && arr.push(<span>/</span>)
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
        const url = computed(() => protocol.value + parts.value?.map(({ origin, ignored }) => ignored ? '*' : origin)?.join('/') ?? '-')

        const handleParse = () => {
            const originUrl = inputVal.value?.trim?.()
            if (!originUrl) return ElMessage.warning("URL is blank")
            const { protocol, parts } = parseUrl(originUrl)

            setProtocol(protocol)
            setParts(parts)
            openEditing()
        }

        const reset = () => {
            closeEditing()
            resetInputVal()
        }

        return () => (
            <div style={{ width: '100%' }}>
                <ElInput
                    v-show={!editing.value}
                    size="small"
                    modelValue={inputVal.value}
                    onInput={setInputVal}
                    clearable
                    onClear={resetInputVal}
                    onKeydown={(e: KeyboardEvent) => e.code === "Enter" && handleParse()}
                    v-slots={{
                        append: () => (
                            <ElButton icon={<Cpu />} onClick={handleParse}>
                                {t(msg => msg.limit.button.parseUrl)}
                            </ElButton>
                        )
                    }}
                    placeholder={t(msg => msg.limit.urlPlaceholder)}
                />
                <div
                    v-show={editing.value}
                    style={{ width: '100%' }}
                >
                    <div
                        style={{ display: 'flex', width: '100%', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}
                    >
                        <ElSelect
                            modelValue={protocol.value}
                            onChange={(val: Protocol) => setProtocol(val)}
                            style={{ width: '120px', marginBottom: '6px' }}
                        >
                            {ALL_PROTOCOLS.map(p => <ElOption value={p} label={p} />)}
                        </ElSelect>
                        {parts.value?.map((item, idx, arr) => idx
                            ? <ElTag
                                type="info"
                                closable
                                onClose={() => setParts(arr.filter((_, i) => i < idx))}
                                style={{ height: '32px', marginBottom: 'px' }}
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
                            : <ElTag style={{ height: '32px', marginBottom: '6px' }}>
                                <span>{item.origin}</span>
                            </ElTag>
                        ).reduce(combineTags, [])}
                    </div>
                    <ElAlert closable={false} style={{ marginTop: '10px' }}>
                        {url.value}
                    </ElAlert>
                    <div>
                        <ElLink
                            icon={<Close />}
                            onClick={reset}
                        >
                            {t(msg => msg.button.cancel)}
                        </ElLink>
                        <ElLink
                            type="primary"
                            icon={<Check />}
                            onClick={() => ctx.emit('save', url.value)}
                        >
                            {t(msg => msg.button.save)}
                        </ElLink>
                    </div>
                </div>
            </div>
        )
    }
})

export default _default