import { t } from "@app/locale"
import { ElCard, ElSelect } from "element-plus"
import { defineComponent, h, ref, useSlots, watch } from "vue"
import { useRouter } from "vue-router"
import ContentContainer from "../common/ContentContainer"
import { CATE_LABELS, changeQuery, type OptionCategory, parseQuery } from "./common"

const IGNORED_CATE: OptionCategory[] = ['dailyLimit']

const _default = defineComponent(() => {
    const tab = ref<OptionCategory>(parseQuery() || 'appearance')
    const router = useRouter()
    watch(tab, () => changeQuery(tab.value, router))

    const slots = useSlots()

    return () => (
        <ContentContainer
            v-slots={{
                filter: () => (
                    <ElSelect
                        modelValue={tab.value}
                        onChange={val => tab.value = val}
                    >
                        {Object.keys(slots)
                            .filter(key => !IGNORED_CATE.includes(key as OptionCategory) && key !== 'default')
                            .map((cate: OptionCategory) => (
                                <ElSelect.Option
                                    label={t(CATE_LABELS[cate])}
                                    value={cate}
                                />
                            ))
                        }
                    </ElSelect>
                ),
                default: () => (
                    <ElCard class="option-select-card">
                        {h(slots[tab.value])}
                    </ElCard>
                )
            }}
        />
    )
})

export default _default