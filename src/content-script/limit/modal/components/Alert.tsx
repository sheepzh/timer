import { defineComponent } from "vue"
import { t } from "@cs/locale"
import { getUrl } from "@api/chrome/runtime"
import { useRequest } from "@hooks"
import optionService from "@service/option-service"

const ICON_URL = getUrl('static/images/icon.png')

const _default = defineComponent(() => {
    const defaultPrompt = t(msg => msg.modal.defaultPrompt)
    const { data: prompt } = useRequest(async () => {
        const option = await optionService.getAllOption()
        return option?.limitPrompt || defaultPrompt
    }, { defaultValue: defaultPrompt })
    return () => (
        <div class='alert-container'>
            <h2 class='name-line'>
                <img src={ICON_URL} />
                <span> {t(msg => msg.meta.name)?.toUpperCase()}</span>
            </h2>
            <h1>{prompt.value}</h1>
        </div>
    )
})

export default _default