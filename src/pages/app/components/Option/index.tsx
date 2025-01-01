/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { useMediaSize } from "@hooks"
import { MediaSize } from "@hooks/useMediaSize"
import { defineComponent, ref, type Ref } from "vue"
import { type JSX } from "vue/jsx-runtime"
import { type OptionCategory, type OptionInstance } from "./common"
import AccessibilityOption from "./components/AccessibilityOption"
import AppearanceOption from "./components/AppearanceOption"
import BackupOption from './components/BackupOption'
import LimitOption from './components/LimitOption'
import PopupOption from "./components/PopupOption"
import StatisticsOption from "./components/StatisticsOption"
import Select from "./Select"
import './style.sass'
import Tabs from "./Tabs"

const _default = defineComponent(() => {
    const paneRefMap: { [key in OptionCategory]: Ref<OptionInstance> } = {
        appearance: ref(),
        statistics: ref(),
        popup: ref(),
        backup: ref(),
        dailyLimit: ref(),
        accessibility: ref(),
    }

    const mediaSize = useMediaSize()

    const slots: { [key in OptionCategory]: () => JSX.Element } = {
        appearance: () => <AppearanceOption ref={paneRefMap.appearance} />,
        statistics: () => <StatisticsOption ref={paneRefMap.statistics} />,
        popup: () => <PopupOption ref={paneRefMap.popup} />,
        dailyLimit: () => <LimitOption ref={paneRefMap.dailyLimit} />,
        accessibility: () => <AccessibilityOption ref={paneRefMap.accessibility} />,
        backup: () => <BackupOption ref={paneRefMap.backup} />,
    }

    const handleReset = async (cate: OptionCategory, callback: () => void) => {
        await paneRefMap[cate]?.value?.reset?.()
        callback?.()
    }

    return () => mediaSize.value <= MediaSize.sm
        ? <Select v-slots={slots} />
        : (
            <Tabs
                limitDisabled={mediaSize.value <= MediaSize.sm}
                onReset={handleReset}
                v-slots={slots}
            />
        )
})

export default _default