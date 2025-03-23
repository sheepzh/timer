import Flex from "@pages/components/Flex"
import { type PopupQuery } from "@popup/common"
import DurationSelect from "@popup/components/Footer/DurationSelect"
import { usePopupContext } from "@popup/context"
import { t } from "@popup/locale"
import { ALL_DIMENSIONS } from "@util/stat"
import { ElOption, ElSelect, ElText } from "element-plus"
import { defineComponent } from "vue"
import Menu from "./Menu"

const Footer = defineComponent({
    props: {
        total: String,
    },
    setup() {
        const { query, setQuery } = usePopupContext()

        const updateQuery = <K extends keyof PopupQuery>(k: K, v: PopupQuery[K]) => {
            setQuery({ ...query.value, [k]: v } satisfies PopupQuery)
        }

        return () => (
            <Flex
                justify="space-between"
                width="100%"
            >
                <Flex>
                    <Menu />
                </Flex>
                <Flex gap={8}>
                    <Flex gap={4}>
                        <ElText>{t(msg => msg.shared.merge.mergeBy)}</ElText>
                        <ElSelect
                            modelValue={query.value?.mergeMethod}
                            onChange={(val: timer.stat.MergeMethod) => updateQuery('mergeMethod', val || undefined)}
                            placeholder={t(msg => msg.shared.merge.mergeMethod.notMerge)}
                            popperOptions={{ placement: 'top' }}
                            style={{ width: '90px' }}
                        >
                            <ElOption value='' label={t(msg => msg.shared.merge.mergeMethod.notMerge)} />
                            {(['domain', 'cate'] satisfies timer.stat.MergeMethod[]).map(method => (
                                <ElOption value={method} label={t(msg => msg.shared.merge.mergeMethod[method])} />
                            ))}
                        </ElSelect>
                    </Flex>
                    <DurationSelect
                        reverse
                        modelValue={[query.value?.duration, query.value?.durationNum]}
                        onChange={([duration, durationNum]) => setQuery({ ...query.value, duration, durationNum })}
                    />
                    <ElSelect
                        modelValue={query?.value?.type}
                        onChange={(v: timer.core.Dimension) => updateQuery('type', v)}
                        popperOptions={{ placement: 'top' }}
                        style={{ width: '120px' }}
                    >
                        {ALL_DIMENSIONS.map(item => <ElOption value={item} label={t(msg => msg.item[item])} />)}
                    </ElSelect>
                </Flex>
            </Flex >
        )
    }
})

export default Footer