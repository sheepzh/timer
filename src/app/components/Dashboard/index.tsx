/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent } from "vue"
import ContentContainer from "@app/components/common/content-container"
import DashboardCard from './DashboardCard'
import "./style"
import { isTranslatingLocale, locale } from "@i18n"
import { ElRow } from "element-plus"
import Indicator from "./components/Indicator"
import WeekOnWeek from "./components/WeekOnWeek"
import TopKVisit from "./components/TopKVisit"
import CalendarHeatMap from "./components/CalendarHeatMap"
import { useRouter } from "vue-router"

const HelpTranslation = defineComponent(() => {
    const router = useRouter()
    const handleClick = () => router.push({ path: "/other/help" })
    return () => (
        <ElRow gutter={40}>
            <span class="help-us-link" onClick={handleClick}>
                💡 Help us translate this extension/addon into your native language!
            </span>
        </ElRow>
    )
})

const _default = defineComponent({
    name: 'Dashboard',
    render: () => (
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
                    <CalendarHeatMap />
                </DashboardCard>
            </ElRow>
            {
                // Only shows for translating languages' speakers in English
                locale === "en" && isTranslatingLocale() && <HelpTranslation />
            }
        </ContentContainer>
    )
})

export default _default