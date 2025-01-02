import { useEcharts } from "@hooks/useEcharts"
import { PopupResult } from "@popup/common"
import { usePopupContext } from "@popup/context"
import { defineComponent, type PropType, toRef, watch } from "vue"
import Wrapper from "./Wrapper"

const Site = defineComponent({
    props: {
        value: Object as PropType<PopupResult>,
    },
    setup(props) {
        const { darkMode } = usePopupContext()
        const data = toRef(props, 'value')
        const { elRef, refresh } = useEcharts(Wrapper, data, { watch: true })
        watch(darkMode, refresh)

        return () => <div ref={elRef} style={{ width: '100%', height: '100%' }} />
    }
})

export default Site