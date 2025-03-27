import { t } from "@app/locale"
import { useState } from "@hooks"
import Box from "@pages/components/Box"
import Flex from "@pages/components/Flex"
import { range } from "@util/array"
import { ElCheckboxButton, ElCheckboxGroup, ElFormItem, ElSegmented } from "element-plus"
import { defineComponent, StyleValue } from "vue"
import { useItem, useItemData } from "./useItem"

const ALL_WEEKDAYS = t(msg => msg.calendar.weekDays)?.split('|')

const Weekday = defineComponent(() => {
    const { weekdays } = useItemData()
    const value = weekdays?.length ? weekdays : range(7)

    return () => (
        <ElCheckboxGroup size="small" modelValue={value}>
            {ALL_WEEKDAYS.map((name, idx) => <ElCheckboxButton value={idx} label={name} />)}
        </ElCheckboxGroup>
    )
})

type SegVal = "daily" | "weekly" | 'periods'

type SegOption = { value: SegVal, label: string }

const computeInitialSeg = (item: timer.limit.Item): SegVal => {
    const { waste, visit, weeklyWaste, weeklyVisit, periods } = item
    if (waste || visit) {
        return 'daily'
    } else if (weeklyWaste || weeklyVisit) {
        return 'weekly'
    } else if (periods?.length) {
        return 'periods'
    } else {
        // by default
        return 'daily'
    }
}

const Body = defineComponent(() => {
    const { data } = useItem()
    const [seg, setSeg] = useState(computeInitialSeg(data))

    const options: SegOption[] = [
        {
            value: 'daily',
            label: t(msg => msg.limit.item.daily),
        }, {
            value: 'weekly',
            label: t(msg => msg.limit.item.weekly),
        }, {
            value: 'periods',
            label: t(msg => msg.limit.item.period),
        },
    ]

    return () => (
        <Flex flex={1} padding="0 20px 20px 20px" width="100%" boxSizing="border-box" direction="column">
            <Flex flex={1}>
                <Box textAlign="center" height="fit-content" width="100%">
                    <ElSegmented
                        modelValue={seg.value}
                        onChange={setSeg}
                        options={options}
                        size="small"
                    />
                </Box>
            </Flex>
            <Flex>
                <ElFormItem
                    label={t(msg => msg.limit.item.effectiveDay)}
                    style={{ marginBottom: 0 } satisfies StyleValue}
                >
                    <Weekday value={data.weekdays} />
                </ElFormItem>
            </Flex>
        </Flex>
    )
})

export default Body