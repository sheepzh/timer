import { t } from "@app/locale"
import { ElCard, ElSelect } from "element-plus"
import { defineComponent, h, ref, useSlots, watch } from "vue"
import { useRouter } from "vue-router"
import ContentContainer from "../common/ContentContainer"
import { changeQuery, type OptionCategory, parseQuery } from "./common"

const _default = defineComponent(() => {
    const tab = ref<OptionCategory>(parseQuery() || 'appearance')
    const router = useRouter()
    watch(tab, () => changeQuery(tab.value, router))

    return () => (
        <ContentContainer
            v-slots={{
                filter: () => (
                    <ElSelect
                        modelValue={tab.value}
                        onChange={val => tab.value = val}
                    >
                        <ElSelect.Option
                            label={t(msg => msg.option.appearance.title)}
                            value={'appearance' satisfies OptionCategory}
                        />
                        <ElSelect.Option
                            label={t(msg => msg.option.statistics.title)}
                            value={'statistics' satisfies OptionCategory}
                        />
                        <ElSelect.Option
                            label={t(msg => msg.option.popup.title)}
                            value={'popup' satisfies OptionCategory}
                        />
                        <ElSelect.Option
                            label={t(msg => msg.option.backup.title)}
                            value={'backup' satisfies OptionCategory}
                        />
                    </ElSelect>
                ),
                default: () => (
                    <ElCard class="option-select-card">
                        {h(useSlots()[tab.value])}
                    </ElCard>
                )
            }}
        />
    )
})

export default _default