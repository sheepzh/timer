import { useEcharts } from "@hooks/useEcharts"
import { computed, defineComponent, type StyleValue } from "vue"
import { useTopKFilter, useTopKValue } from "../context"
import Wrapper from "./Wrapper"

const CONTAINER_STYLE: StyleValue = {
    width: "100%",
    height: "220%",
}

const _default = defineComponent(() => {
    const value = useTopKValue()
    const { elRef } = useEcharts(Wrapper, value, { manual: true })
    return () => <div style={CONTAINER_STYLE} ref={elRef} />
})

export default _default