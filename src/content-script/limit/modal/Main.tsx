import { defineComponent, watch } from "vue"
import { useReason, provideRule } from "./context"
import Alert from "./components/Alert"
import Reason from "./components/Reason"
import Footer from "./components/Footer"
import { useRequest, useWindowVisible } from "@hooks"
import "./style"
import limitService from "@service/limit-service"

const _default = defineComponent(() => {
    const reason = useReason()
    const windowVisible = useWindowVisible()

    const { data: rule, refresh } = useRequest(async () => {
        if (!windowVisible.value) return null
        const reasonId = reason.value?.id
        if (!reasonId) return null
        const rules = await limitService.select({ id: reasonId, filterDisabled: false })
        return rules?.[0]
    })

    provideRule(rule)

    watch([reason, windowVisible], refresh)

    return () => (
        <div id="app">
            <div style={{ width: '100%' }}>
                <Alert />
                <Reason />
                <Footer />
            </div>
        </div>
    )
})

export default _default