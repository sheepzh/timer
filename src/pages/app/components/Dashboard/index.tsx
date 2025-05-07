/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { useManualRequest, useMediaSize, useRequest } from "@hooks"
import { MediaSize } from "@hooks/useMediaSize"
import { isTranslatingLocale, locale } from "@i18n"
import Flex from "@pages/components/Flex"
import metaService from "@service/meta-service"
import { REVIEW_PAGE } from "@util/constant/url"
import { useWindowSize } from "@vueuse/core"
import { ElRow } from "element-plus"
import { computed, defineComponent, useSlots } from "vue"
import { useRouter } from "vue-router"
import ContentContainer from "../common/ContentContainer"
import Calendar from "./components/Calendar"
import Indicator from "./components/Indicator"
import MonthOnMonth from "./components/MonthOnMonth"
import TopKVisit from "./components/TopKVisit"
import DashboardCard from './DashboardCard'
import "./style"

const ROW_GUTTER = 15

const Link = defineComponent<{ onClick?: () => void }>(({ onClick }) => {
    const slots = useSlots()
    return () => (
        <Flex
            width="100%"
            cursor="pointer"
            color="text-primary"
            justify="center"
            align="center"
            fontSize={14}
            onClick={onClick}
            v-slots={slots}
        />
    )
})

const _default = defineComponent(() => {
    const router = useRouter()
    const jump2Help = () => router.push({ path: "/other/help" })
    const isNotEnOrZhCn = locale !== "en" && locale !== "zh_CN"
    const showHelp = isTranslatingLocale() || isNotEnOrZhCn
    const { data: showRate, refresh } = useRequest(metaService.recommendRate)
    const { refresh: handleRate } = useManualRequest(() => metaService.saveFlag("rateOpen"), { onSuccess: refresh })

    const { width } = useWindowSize()
    const mediaSize = useMediaSize()
    const showCalendar = computed(() => mediaSize.value >= MediaSize.lg)

    return () => (
        <ContentContainer class="dashboard-container">
            <ElRow gutter={ROW_GUTTER}>
                {width.value < 1400
                    ? <>
                        <DashboardCard span={width.value < 600 ? 24 : 8}>
                            <Indicator />
                        </DashboardCard>
                        <DashboardCard span={width.value < 600 ? 24 : 16}>
                            <TopKVisit />
                        </DashboardCard>
                        <DashboardCard span={24}>
                            <MonthOnMonth />
                        </DashboardCard>
                    </>
                    : <>
                        <DashboardCard span={4}>
                            <Indicator />
                        </DashboardCard>
                        <DashboardCard span={12}>
                            <MonthOnMonth />
                        </DashboardCard>
                        <DashboardCard span={8}>
                            <TopKVisit />
                        </DashboardCard>
                    </>}
                <DashboardCard v-show={showCalendar.value} span={24}>
                    <Calendar />
                </DashboardCard>
            </ElRow>
            <ElRow v-show={showHelp || showRate.value}>
                {showRate.value ? (
                    <Link>
                        🌟 {t(msg => msg.about.text.greet)}&ensp;
                        <a
                            href={REVIEW_PAGE}
                            target="_blank"
                            onClick={handleRate}
                            style={{ color: 'inherit' }}
                        >
                            {t(msg => msg.about.text.rate)}
                        </a>
                    </Link>
                ) : (
                    <Link onClick={jump2Help}>
                        💡 Help us translate this extension/addon into your native language!
                    </Link>
                )}
            </ElRow>
        </ContentContainer>
    )
})

export default _default