import HostAlert from "@app/components/common/HostAlert"
import Flex from "@pages/components/Flex"
import { SiteMap } from "@util/site"
import { ElScrollbar } from "element-plus"
import { computed, defineComponent, StyleValue, toRefs } from "vue"

type Props = {
    modelValue?: timer.stat.Row[]
    clickDisabled?: boolean
}

const TooltipSiteList = defineComponent<Props>(props => {
    const { modelValue, clickDisabled: clickable } = toRefs(props)
    const iconMap = computed(() => {
        const siteMap = new SiteMap<string>()
        modelValue?.value?.forEach(({ siteKey, iconUrl }) => siteKey && siteMap.put(siteKey, iconUrl))
        return siteMap
    })
    return () => (
        <ElScrollbar
            maxHeight="400px"
            height="fit-content"
            viewStyle={{ padding: '10px 0', marginInlineEnd: '11px' } satisfies StyleValue}
        >
            <Flex gap={8} column>
                {iconMap.value?.map((key, icon) => (
                    <HostAlert value={key} iconUrl={icon} clickable={!clickable} />
                ))}
            </Flex>
        </ElScrollbar>
    )
}, { props: ['clickDisabled', 'modelValue'] })

export default TooltipSiteList