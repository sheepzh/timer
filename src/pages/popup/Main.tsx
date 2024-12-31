import { useRequest } from "@hooks/useRequest"
import Flex from "@pages/components/Flex"
import optionService from "@service/option-service"
import { isDarkMode, toggle } from "@util/dark-mode"
import { defineComponent, ref } from "vue"
import Chart from "./components/Chart"
import Header from "./components/Header"
import { initProvider } from "./context"

const Main = defineComponent(() => {
    const appKey = ref(Date.now())
    const reload = () => appKey.value = Date.now()

    const { data: darkMode, refresh: refreshDarkMode } = useRequest(() => optionService.isDarkMode(), { defaultValue: isDarkMode() })

    const setDarkMode = async (val: boolean) => {
        const option: timer.option.DarkMode = val ? 'on' : 'off'
        await optionService.setDarkMode(option)
        toggle(val)
        refreshDarkMode()
    }

    initProvider({ reload, darkMode, setDarkMode })

    return () => (
        <Flex
            key={appKey.value}
            width='100%'
            height='100%'
            direction="column"
            gap={10}
        >
            <Header />
            <Chart />
        </Flex>
    )
})

export default Main


