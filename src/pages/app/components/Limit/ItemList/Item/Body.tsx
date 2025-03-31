import { t } from "@app/locale"
import { useState } from "@hooks"
import Box from "@pages/components/Box"
import Flex from "@pages/components/Flex"
import { ElSegmented } from "element-plus"
import { defineComponent } from "vue"
import { useItem } from "./context"
import Maximum from "./Maximum"
import Period from "./Period"

type SegVal = "maximum" | 'periods'

type SegOption = { value: SegVal, label: string }

const computeInitialSeg = (item: timer.limit.Item): SegVal => {
    const { waste, visit, weeklyWaste, weeklyVisit, periods } = item
    if (waste || visit || weeklyWaste || weeklyVisit) {
        return 'maximum'
    } else if (periods?.length) {
        return 'periods'
    } else {
        // by default
        return 'maximum'
    }
}

const Body = defineComponent(() => {
    const data = useItem()
    const [seg, setSeg] = useState(computeInitialSeg(data))

    const options: SegOption[] = [
        {
            value: 'maximum',
            label: t(msg => msg.limit.item.maximum),
        }, {
            value: 'periods',
            label: t(msg => msg.limit.item.period),
        },
    ]

    return () => (
        <Flex
            flex={1}
            gap={30}
            padding="0 20px 20px 20px"
            width="100%"
            boxSizing="border-box"
            direction="column"
        >
            <Flex flex={1}>
                {seg.value === 'maximum' && <Maximum />}
                {seg.value === 'periods' && <Period />}
            </Flex>
            <Box textAlign="center" height="fit-content" width="100%">
                <ElSegmented
                    modelValue={seg.value}
                    onChange={setSeg}
                    options={options}
                    size="small"
                />
            </Box>
        </Flex>
    )
})

export default Body