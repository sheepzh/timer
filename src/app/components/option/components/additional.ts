import { ElCard, ElSwitch } from "element-plus"
import { defineComponent, h, Ref, ref } from "vue"
import optionService from "../../../../service/option-service"
import { defaultAdditional } from "../../../../util/constant/option"
import { t } from "../../../locale"
import { renderHeader, renderOptionItem, tagText } from "../common"

const optionRef: Ref<Timer.AdditionalOption> = ref(defaultAdditional())
optionService.getAllOption().then(option => optionRef.value = option)

const displayWhitelist = () => h(ElSwitch, {
    modelValue: optionRef.value.displayWhitelistMenu,
    onChange: (newVal: boolean) => {
        optionRef.value.displayWhitelistMenu = newVal
        optionService.setAdditionalOption(optionRef.value)
    }
})

const options = () => [
    renderOptionItem({
        input: displayWhitelist(),
        whitelist: tagText(msg => msg.option.additional.whitelistItem),
        contextMenu: tagText(msg => msg.option.additional.contextMenu)
    },
        msg => msg.additional.displayWhitelist, t(msg => msg.option.yes)
    )
]

const _default = defineComponent(() => {
    return () => h(ElCard, {}, {
        header: () => renderHeader(msg => msg.additional.title, () => optionService.setAdditionalOption(optionRef.value = defaultAdditional())),
        default: options
    })
})

export default _default