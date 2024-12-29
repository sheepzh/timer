import Flex from "@src/pages/components/Flex"
import HostAlert from "@src/pages/app/components/common/HostAlert"
import { SiteMap } from "@util/site"
import { ElScrollbar } from "element-plus"
import { defineComponent, PropType } from "vue"

const TooltipSiteList = defineComponent({
    props: {
        modelValue: Array as PropType<timer.stat.Row[]>,
        clickDisabled: Boolean,
    },
    setup(props) {
        return () => {
            const siteMap = new SiteMap<string>()
            props.modelValue?.forEach(({ siteKey, iconUrl }) => siteMap.put(siteKey, iconUrl))

            return (
                <ElScrollbar maxHeight="400px" viewStyle={{ padding: '10px 0', marginRight: '11px' }}>
                    <Flex gap={8} direction="column">
                        {siteMap?.map((siteKey, iconUrl) => (
                            <HostAlert
                                host={siteKey?.host}
                                iconUrl={iconUrl}
                                clickable={!props.clickDisabled}
                            />
                        ))}
                    </Flex>
                </ElScrollbar>
            )
        }
    },
})

export default TooltipSiteList