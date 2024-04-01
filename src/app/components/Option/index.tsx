/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"
import type { Router } from "vue-router"

import ContentContainer from "../common/ContentContainer"
import { defineComponent, ref } from "vue"
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

const resetButtonName = "reset"
const initialParamName = "i"
const allCategories = ["appearance", "statistics", "popup", 'dailyLimit', 'backup'] as const
type _Category = typeof allCategories[number]

function initWithQuery(tab: Ref<_Category>) {
    const initialQuery: string | string[] | undefined = useRoute().query?.[initialParamName]
    const queryVal: string | undefined = Array.isArray(initialQuery) ? initialQuery[0] : initialQuery
    if (!queryVal) {
        return
    }
    if (allCategories.includes(queryVal as _Category)) {
        tab.value = queryVal as _Category
    }
}

/**
 * Handle before leave the option panel tabs
 *
 * @param currentActiveNameAndOld
 * @param paneRefMap
 * @param router
 * @returns promise to leave, or not
 */
function handleBeforeLeave(
    currentActiveNameAndOld: [string, string],
    paneRefMap: Record<_Category, Ref>,
    router: Router
): Promise<void> {
    const [activeName, oldActiveName] = currentActiveNameAndOld
    return new Promise((resolve, reject) => {
        if (activeName !== resetButtonName) {
            // Change the query of current route
            const query = {}
            query[initialParamName] = activeName
            router.replace({ query })
            return resolve()
        }
        const cate: _Category = oldActiveName as _Category
        const resetFunc = paneRefMap[cate]?.value?.reset
        resetFunc ? resetFunc()
            .then(() => ElMessage.success(t(msg => msg.option.resetSuccess)))
            .finally(reject)
            : reject()
    })
}

const _default = defineComponent({
    setup() {
        const tab: Ref<_Category> = ref('appearance')
        initWithQuery(tab)

        const paneRefMap: { [key in _Category]: Ref } = {
            appearance: ref(),
            statistics: ref(),
            popup: ref(),
            backup: ref(),
            dailyLimit: ref(),
        }
        const router = useRouter()
        return () => (
            <ContentContainer>
                <ElTabs
                    modelValue={tab.value}
                    type="border-card"
                    beforeLeave={(active: string, oldActive: string) => handleBeforeLeave([active, oldActive], paneRefMap, router)}
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
    }
})

export default _default