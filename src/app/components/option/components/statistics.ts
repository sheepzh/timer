import { ElCard, ElSwitch, ElTooltip } from "element-plus"
import optionService from "../../../../service/option-service"
import { defaultStatistics } from "../../../../util/constant/option"
import { defineComponent, h, Ref, ref } from "vue"
import { t } from "../../../locale"
import { renderHeader, renderOptionItem, tagText } from "../common"

const optionRef: Ref<Timer.StatisticsOption> = ref(defaultStatistics())
optionService.getAllOption().then(option => optionRef.value = option)

function updateOptionVal(key: keyof Timer.StatisticsOption, newVal: boolean) {
    const value = optionRef.value
    value[key] = newVal
    optionService.setStatisticsOption(value)
}

const countWhenIdle = () => h(ElSwitch, {
    modelValue: optionRef.value.countWhenIdle,
    onChange: (newVal: boolean) => updateOptionVal('countWhenIdle', newVal)
})

const options = () => [
    renderOptionItem({
        input: countWhenIdle(),
        idleTime: tagText(msg => msg.option.statistics.idleTime),
        info: h(ElTooltip, { content: t(msg => msg.option.statistics.idleTimeInfo) }, { default: () => h('i', { class: 'el-icon-info' }) })
    }, msg => msg.statistics.countWhenIdle, t(msg => msg.option.no))
]

const _default = defineComponent(() => {
    return () => h(ElCard, {
    }, {
        header: () => renderHeader(
            msg => msg.statistics.title,
            () => optionService.setStatisticsOption(optionRef.value = defaultStatistics())),
        default: options
    })
})

export default _default