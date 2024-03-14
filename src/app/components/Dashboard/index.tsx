/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent } from "vue"
import ContentContainer from "../common/content-container"
import DashboardCard from './DashboardCard'
import "./style"
import { isTranslatingLocale, locale } from "@i18n"
import { ElRow } from "element-plus"
import Indicator from "./components/Indicator"
import WeekOnWeek from "./components/WeekOnWeek"
import TopKVisit from "./components/TopKVisit"
import CalendarHeatmapChart from "./components/CalendarHeatmapChart"
import { useRouter } from "vue-router"

const _default = defineComponent(() => {
    const router = useRouter()
    const jump2Help = () => router.push({ path: "/other/help" })
    const isNotEnOrZhCn = locale !== "en" && locale !== "zh_CN"
    const showHelp = isTranslatingLocale() || isNotEnOrZhCn

    return () => (
        <ContentContainer>
            <ElRow gutter={20} style={{ height: "300px" }}>
                <DashboardCard span={4}>
                    <Indicator />
                </DashboardCard>
                <DashboardCard span={12}>
                    <WeekOnWeek />
                </DashboardCard>
                <DashboardCard span={8}>
                    <TopKVisit />
                </DashboardCard>
            </ElRow>
            <ElRow gutter={40} style={{ height: "280px" }}>
                <DashboardCard span={24}>
                    <CalendarHeatmapChart />
                </DashboardCard>
            </ElRow>
            <ElRow v-show={showHelp}>
                <span class="help-us-link" onClick={jump2Help}>
                    💡 Help us translate this extension/addon into your native language!
                </span>
            </ElRow>
        </ContentContainer>
    )
})

export default _default