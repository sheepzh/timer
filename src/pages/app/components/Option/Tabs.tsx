import { t } from "@app/locale"
import { Refresh } from "@element-plus/icons-vue"
import { useShadow } from "@hooks"
import { ElIcon, ElMessage, ElTabPane, ElTabs } from "element-plus"
import { defineComponent, h, ref } from "vue"
import { useRouter } from "vue-router"
import ContentContainer from "../common/ContentContainer"
import { changeQuery, type OptionCategory, parseQuery } from "./common"

const resetButtonName = "reset"

const _default = defineComponent({
    props: {
        limitDisabled: Boolean,
    },
    emits: {
        reset: (_cate: OptionCategory, _callback: () => void) => Promise.resolve(true),
    },
    setup: (props, ctx) => {
        const tab = ref(parseQuery() || 'appearance')
        const router = useRouter()
        const [limitDisabled] = useShadow(() => props.limitDisabled)

        const handleBeforeLeave = async (activeName: string, oldActiveName: string): Promise<boolean> => {
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
                    <ElTabPane
                        name={"appearance" satisfies OptionCategory}
                        label={t(msg => msg.option.appearance.title)}
                    >
                        {h(ctx.slots.appearance)}
                    </ElTabPane>
                    <ElTabPane
                        name={"statistics" satisfies OptionCategory}
                        label={t(msg => msg.option.statistics.title)}
                    >
                        {h(ctx.slots.statistics)}
                    </ElTabPane>
                    <ElTabPane
                        name={"popup" satisfies OptionCategory}
                        label={t(msg => msg.option.popup.title)}
                    >
                        {h(ctx.slots.popup)}
                    </ElTabPane>
                    {!limitDisabled.value && (
                        <ElTabPane
                            name={"dailyLimit" satisfies OptionCategory}
                            label={t(msg => msg.menu.limit)}
                        >
                            {h(ctx.slots.dailyLimit)}
                        </ElTabPane>
                    )}
                    <ElTabPane
                        name={"accessibility" satisfies OptionCategory}
                        label={t(msg => msg.option.accessibility.title)}
                    >
                        {h(ctx.slots.accessibility)}
                    </ElTabPane>
                    <ElTabPane
                        name={"backup" satisfies OptionCategory}
                        label={t(msg => msg.option.backup.title)}
                    >
                        {h(ctx.slots.backup)}
                    </ElTabPane>
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