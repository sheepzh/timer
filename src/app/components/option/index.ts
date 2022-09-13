/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"

import ContentContainer from "../common/content-container"
import { defineComponent, h, ref } from "vue"
import Popup from "./components/popup"
import Appearance from "./components/appearance"
import Statistics from "./components/statistics"
import Backup from './components/backup'
import './style'
import { ElIcon, ElMessage, ElTabPane, ElTabs } from "element-plus"
import { t } from "@app/locale"
import { Refresh } from "@element-plus/icons-vue"
import { useRoute, useRouter } from "vue-router"

const resetButtonName = "reset"
const initialParamName = "i"
const allCategories = ["appearance", "statistics", "popup", 'backup'] as const
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

const _default = defineComponent({
    name: "OptionContainer",
    setup() {
        const tab: Ref<_Category> = ref('appearance')
        initWithQuery(tab)

        const paneRefMap: { [key in _Category]: Ref } = {
            appearance: ref(),
            statistics: ref(),
            popup: ref(),
            backup: ref(),
        }
        const router = useRouter()
        return () => h(ContentContainer, () => h(ElTabs, {
            modelValue: tab.value,
            type: "border-card",
            beforeLeave: (activeName, oldActiveName) => new Promise((resolve, reject) => {
                if (activeName === resetButtonName) {
                    const cate: _Category = oldActiveName as _Category
                    const resetFunc = paneRefMap[cate]?.value?.reset
                    if (resetFunc) {
                        resetFunc()
                            .then(() => ElMessage.success(t(msg => msg.option.resetSuccess)))
                            .finally(reject)
                    } else {
                        reject()
                    }
                } else {
                    // Change the query of current route
                    const query = {}
                    query[initialParamName] = activeName
                    router.replace({ query })
                    resolve()
                }
            })
        }, () => [
            // Appearance
            h(ElTabPane, {
                label: t(msg => msg.option.appearance.title),
                name: "appearance" as _Category
            }, () => h(Appearance, {
                ref: paneRefMap.appearance
            })),
            // Statistics
            h(ElTabPane, {
                label: t(msg => msg.option.statistics.title),
                name: "statistics" as _Category
            }, () => h(Statistics, {
                ref: paneRefMap.statistics
            })),
            // Popup
            h(ElTabPane, {
                label: t(msg => msg.option.popup.title),
                name: "popup" as _Category
            }, () => h(Popup, {
                ref: paneRefMap.popup
            })),
            // backup
            h(ElTabPane, {
                label: t(msg => msg.option.backup.title),
                name: "backup" as _Category
            }, () => h(Backup, {
                ref: paneRefMap.backup
            })),
            // Refresh button
            h(ElTabPane, { label: t(msg => msg.option.resetButton), name: resetButtonName }, {
                label: () => [h(ElIcon, () => h(Refresh)), t(msg => msg.option.resetButton)]
            })
        ]))
    }
})

export default _default