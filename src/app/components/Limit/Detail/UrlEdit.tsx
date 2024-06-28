import { Cpu, Close, Check } from "@element-plus/icons-vue"
import { useSwitch, useState } from "@hooks"
import { t } from "@app/locale"
import { ElMessage, ElInput, ElButton, ElSelect, ElOption, ElTag, ElTooltip, ElSwitch, ElAlert, ElDialog } from "element-plus"
import { VNode, computed, defineComponent } from "vue"
import { Protocol, UrlPart, parseUrl } from "../LimitModify/Sop/common"

const ALL_PROTOCOLS: Protocol[] = ['http://', 'https://', '*://']

const combineTags = (arr: VNode[], current: VNode) => {
    arr.length && arr.push(<span>/</span>)
    arr.push(current)
    return arr
}

const _default = defineComponent({
    props: {
        visible: Boolean
    },
    emits: {
        save: (_url: string) => true,
        cancel: () => true,
    },
    setup(props, ctx) {
        const [inputting, openInputting, closeInputting] = useSwitch(true)
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
            closeInputting()
        }

        const handleCancel = () => {
            ctx.emit('cancel')
            openInputting()
            resetInputVal()
        }

        const handleSave = () => {
            ctx.emit('save', url.value)
            openInputting()
            resetInputVal()
        }

        return () => (
            <ElDialog
                title={t(msg => msg.button.create)}
                modelValue={props.visible}
                closeOnClickModal={false}
                onUpdate:modelValue={handleCancel}
                modalClass="limit-url-edit"
                v-slots={{
                    footer: () => (
                        <div>
                            <ElButton type="text" icon={<Close />} onClick={handleCancel}>
                                {t(msg => msg.button.cancel)}
                            </ElButton>
                            <ElButton disabled={inputting.value} type="primary" icon={<Check />} onClick={handleSave}>
                                {t(msg => msg.button.save)}
                            </ElButton>
                        </div>
                    )
                }}
            >
                <ElInput
                    v-show={inputting.value}
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
                <div v-show={!inputting.value}>
                    <div class="url-part">
                        <ElSelect
                            size="small"
                            modelValue={protocol.value}
                            onChange={(val: Protocol) => setProtocol(val)}
                        >
                            {ALL_PROTOCOLS.map(p => <ElOption value={p} label={p} />)}
                        </ElSelect>
                        {parts.value?.map((item, idx, arr) => idx
                            ? <ElTag
                                type="info"
                                closable
                                onClose={() => setParts(arr.filter((_, i) => i < idx))}
                            >
                                <ElTooltip content={t(msg => msg.limit.useWildcard)}>
                                    <ElSwitch
                                        modelValue={item.ignored}
                                        onChange={(val: boolean) => {
                                            item.ignored = val
                                            setParts([...arr])
                                        }}
                                    />
                                </ElTooltip>
                                <span>{item.ignored ? '*' : item.origin}</span>
                            </ElTag>
                            : <ElTag>{item.origin}</ElTag>
                        ).reduce(combineTags, [])}
                    </div>
                    <ElAlert closable={false} type="success">
                        {url.value}
                    </ElAlert>
                </div>
            </ElDialog>
        )
    }
})

export default _default