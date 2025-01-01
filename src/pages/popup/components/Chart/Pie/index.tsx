import { useEcharts } from "@hooks/useEcharts"
import { type PopupResult } from "@popup/common"
import { usePopupContext } from "@popup/context"
import { defineComponent, type PropType, toRef, watch } from "vue"
import Wrapper from "./Wrapper"
import { handleClick } from "./handler"

const Pie = defineComponent({
    props: {
        value: Object as PropType<PopupResult>,
    },
    emits: {
        restore: () => true,
    },
    setup: (props, ctx) => {
        const myValue = toRef(props, 'value')
        const { darkMode } = usePopupContext()
        const { elRef, refresh } = useEcharts(Wrapper, myValue, {
            watch: true,
            afterInit(ew) {
                ew.instance.on('click', params => handleClick(params, myValue.value))
                ew.instance.on('restore', () => ctx.emit('restore'))
            },
        })
        watch(darkMode, refresh)

        return () => <div id="chart-container" ref={elRef} />
    }
})

export default Pie