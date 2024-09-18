import { t } from "@app/locale"
import optionService from "@service/option-service"
import { defaultAccessibility } from "@util/constant/option"
import { ElSwitch } from "element-plus"
import { defineComponent, reactive, unref, watch } from "vue"
import { OptionInstance } from "../common"
import OptionItem from "./OptionItem"

function copy(target: timer.option.AccessibilityOption, source: timer.option.AccessibilityOption) {
    target.chartDecal = source.chartDecal
}

const _default = defineComponent((_, ctx) => {
    const option = reactive(defaultAccessibility())
    optionService.getAllOption()
        .then(currentVal => {
            copy(option, currentVal)
            watch(option, () => optionService.setAccessibilityOption(unref(option)))
        })
    ctx.expose({
        reset: () => copy(option, defaultAccessibility())
    } satisfies OptionInstance)
    return () => <>
        <OptionItem
            label={msg => msg.option.accessibility.chartDecal}
            defaultValue={t(msg => msg.option.no)}
            hideDivider
            v-slots={{
                default: () => <ElSwitch
                    modelValue={option.chartDecal}
                    onChange={(val: boolean) => option.chartDecal = val}
                />
            }}
        />
    </>
})

export default _default