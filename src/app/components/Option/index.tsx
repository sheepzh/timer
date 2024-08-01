/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import ContentContainer from "../common/ContentContainer"
import { defineComponent, ref, type Ref } from "vue"
import PopupOption from "./components/PopupOption"
import Appearance from "./components/AppearanceOption"
import StatisticsOption from "./components/StatisticsOption"
import BackupOption from './components/BackupOption'
import LimitOption from './components/LimitOption'
import './style'
import { ElIcon, ElMessage, ElTabPane, ElTabs } from "element-plus"
import { t } from "@app/locale"
import { Refresh } from "@element-plus/icons-vue"
import { useRoute, useRouter } from "vue-router"
import { OptionInstance } from "./common"

const resetButtonName = "reset"
const initialParamName = "i"
const allCategories = ["appearance", "statistics", "popup", 'dailyLimit', 'backup'] as const
type _Category = typeof allCategories[number]

function parseQuery(): _Category {
    const initialQuery: string | string[] | undefined = useRoute().query?.[initialParamName]
    const queryVal: string | undefined = Array.isArray(initialQuery) ? initialQuery[0] : initialQuery
    if (!queryVal) return null
    const cate = queryVal as _Category
    return allCategories.includes(cate) ? cate : null
}

const _default = defineComponent(() => {
    const tab = ref<_Category>(parseQuery() || 'appearance')

    const paneRefMap: { [key in _Category]: Ref<OptionInstance> } = {
        appearance: ref(),
        statistics: ref(),
        popup: ref(),
        backup: ref(),
        dailyLimit: ref(),
    }
    const router = useRouter()

    const handleBeforeLeave = async (activeName: string, oldActiveName: string): Promise<boolean> => {
        if (activeName === resetButtonName) {
            const cate: _Category = oldActiveName as _Category
            await paneRefMap[cate]?.value?.reset?.()
            ElMessage.success(t(msg => msg.option.resetSuccess))
            return Promise.reject()
        }
        // Change the query of current route
        const query = {}
        query[initialParamName] = activeName
        router.replace({ query })
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
                <ElTabPane name={"appearance" as _Category} label={t(msg => msg.option.appearance.title)}>
                    <Appearance ref={paneRefMap.appearance} />
                </ElTabPane>
                <ElTabPane name={"statistics" as _Category} label={t(msg => msg.option.statistics.title)}>
                    <StatisticsOption ref={paneRefMap.statistics} />
                </ElTabPane>
                <ElTabPane name={"popup" as _Category} label={t(msg => msg.option.popup.title)}>
                    <PopupOption ref={paneRefMap.popup} />
                </ElTabPane>
                <ElTabPane name={"dailyLimit" as _Category} label={t(msg => msg.menu.limit)}>
                    <LimitOption ref={paneRefMap.dailyLimit} />
                </ElTabPane>
                <ElTabPane name={"backup" as _Category} label={t(msg => msg.option.backup.title)}>
                    <BackupOption ref={paneRefMap.backup} />
                </ElTabPane>
                <ElTabPane
                    name={resetButtonName}
                    v-slots={{
                        label: () => <div>
                            <ElIcon>
                                <Refresh />
                            </ElIcon>
                            {t(msg => msg.option.resetButton)}
                        </div>
                    }}
                />
            </ElTabs>
        </ContentContainer>
    )
})

export default _default