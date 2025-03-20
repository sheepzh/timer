import Flex from "@pages/components/Flex"
import { DefaultOption } from "@util/constant/option"
import { defineComponent, inject } from "vue"
import { RouterView } from "vue-router"
import Footer from "./components/Footer"
import Header from "./components/Header"
import { initPopupContext } from "./context"

export const PROVIDE_KEY = 'POPUP_OPTION'

const Main = defineComponent(() => {
    const option = inject(PROVIDE_KEY) as DefaultOption
    const { defaultDuration, defaultType, defaultDurationNum, defaultMergeMethod } = option

    const appKey = initPopupContext({
        mergeMethod: defaultMergeMethod,
        duration: defaultDuration,
        type: defaultType,
        durationNum: defaultDurationNum,
    })

    return () => (
        <Flex key={appKey.value} column width='100%' height='100%' gap={10}>
            <Header />
            <Flex flex={1} height={0}>
                <RouterView />
            </Flex>
            <Footer />
        </Flex>
    )
})

export default Main


