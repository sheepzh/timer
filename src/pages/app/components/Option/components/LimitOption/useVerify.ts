import { judgeVerificationRequired, processVerification } from "@app/util/limit"
import limitService from "@service/limit-service"
import { ref } from "vue"

export const useVerify = (option: timer.option.LimitOption) => {
    const verified = ref(false)

    const verify = async (): Promise<void> => {
        if (verified.value) return
        const items = await limitService.select({ filterDisabled: true, url: undefined })
        console.log(items)
        const triggerResults = await Promise.all((items || []).map(judgeVerificationRequired))
        console.log('triggerResults', triggerResults)
        const anyTrigger = triggerResults.some(t => !!t)
        if (anyTrigger) {
            await processVerification(option)
            console.log('processed', option)
        }
        verified.value = true
    }

    return { verified, verify }
}