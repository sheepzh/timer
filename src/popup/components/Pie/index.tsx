import { useEcharts } from "@hooks/useEcharts"
import { useShadow } from "@hooks/useShadow"
import { PopupResult } from "@popup/common"
import { defineComponent, PropType } from "vue"
import Wrapper from "./Wrapper"
import { handleClick } from "./handler"

const Chart = defineComponent({
    props: {
        value: Object as PropType<PopupResult>,
    },
    emits: {
        restore: () => true,
    },
    setup: (props, ctx) => {
        const [myValue] = useShadow(() => props.value)
        const { elRef } = useEcharts(Wrapper, myValue, {
            watch: true,
            afterInit(ew) {
                ew.instance.on('click', params => handleClick(params, myValue.value))
                ew.instance.on('restore', () => ctx.emit('restore'))
            }
        })

        return () => <div id="chart-container" ref={elRef} />
    }
})

export default Chart