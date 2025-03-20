import { t } from "@app/locale"
import { Refresh } from "@element-plus/icons-vue"
import { ElIcon, ElMessage, ElTabPane, ElTabs, TabPaneName } from "element-plus"
import { defineComponent, h, ref, useSlots } from "vue"
import { useRouter } from "vue-router"
import ContentContainer from "../common/ContentContainer"
import { CATE_LABELS, changeQuery, type OptionCategory, parseQuery } from "./common"

const resetButtonName = "reset"

const _default = defineComponent({
    emits: {
        reset: (_cate: OptionCategory, _callback: () => void) => Promise.resolve(true),
    },
    setup: (_, ctx) => {
        const tab = ref(parseQuery() || 'appearance')
        const router = useRouter()

        const handleBeforeLeave = async (activeName: TabPaneName, oldActiveName: TabPaneName): Promise<boolean> => {
            if (activeName === resetButtonName) {
                const cate: OptionCategory = oldActiveName as OptionCategory
                await new Promise<void>(res => ctx.emit('reset', cate, res))
                ElMessage.success(t(msg => msg.option.resetSuccess))
                return Promise.reject()
            }
            // Change the query of current route
            changeQuery(activeName as OptionCategory, router)
            return true
        }
        return () => (
            <ContentContainer>
                <ElTabs
                    modelValue={tab.value}
                    type="border-card"
                    beforeLeave={handleBeforeLeave}
                    class="option-tab"
                >
                    {Object.entries(useSlots()).filter(([key]) => key !== 'default').map(([key, slot]) => (
                        <ElTabPane name={key} label={t(CATE_LABELS[key as OptionCategory])}>
                            {!!slot && h(slot)}
                        </ElTabPane>
                    ))}
                    <ElTabPane
                        name={resetButtonName}
                        v-slots={{
                            label: () => (
                                <div>
                                    <ElIcon>
                                        <Refresh />
                                    </ElIcon>
                                    {t(msg => msg.option.resetButton)}
                                </div>
                            )
                        }}
                    />
                </ElTabs>
            </ContentContainer>
        )
    }
})

export default _default