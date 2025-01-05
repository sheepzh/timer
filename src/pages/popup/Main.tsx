import { useRequest } from "@hooks/useRequest"
import { useState } from "@hooks/useState"
import Flex from "@pages/components/Flex"
import optionService from "@service/option-service"
import { IS_FIREFOX } from "@util/constant/environment"
import { isDarkMode, toggle } from "@util/dark-mode"
import { defineComponent, onBeforeMount, ref } from "vue"
import { RouterView } from "vue-router"
import { type PopupQuery } from "./common"
import Footer from "./components/Footer"
import Header from "./components/Header"
import { initProvider } from "./context"

const Main = defineComponent(() => {
    const appKey = ref(Date.now())
    const reload = () => {
        if (IS_FIREFOX) {
            // Option change event triggered very late in Firefox, so reload the page directly
            location.reload()
        } else {
            appKey.value = Date.now()
        }
    }

    const { data: darkMode, refresh: refreshDarkMode } = useRequest(() => optionService.isDarkMode(), { defaultValue: isDarkMode() })

    const [query, setQuery] = useState<PopupQuery>()

    onBeforeMount(async () => {
        const option = await optionService.getAllOption()
        const { defaultDuration, defaultType, defaultDurationNum, defaultMergeMethod } = option || {}
        setQuery({
            mergeMethod: defaultMergeMethod,
            type: defaultType,
            duration: defaultDuration,
            durationNum: defaultDurationNum,
        })
    })

    const setDarkMode = async (val: boolean) => {
        const option: timer.option.DarkMode = val ? 'on' : 'off'
        await optionService.setDarkMode(option)
        toggle(val)
        refreshDarkMode()
    }

    initProvider({ reload, darkMode, setDarkMode, query, setQuery })

    return () => (
        <Flex
            key={appKey.value}
            width='100%'
            height='100%'
            direction="column"
            gap={10}
        >
            <Header />
            <Flex flex={1} height={0}>
                <RouterView />
            </Flex>
            <Footer />
        </Flex>
    )
})

export default Main


