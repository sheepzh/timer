import HostAlert from "@app/components/common/HostAlert"
import Flex from "@pages/components/Flex"
import { SiteMap } from "@util/site"
import { ElScrollbar } from "element-plus"
import { defineComponent, type PropType } from "vue"

const TooltipSiteList = defineComponent({
    props: {
        modelValue: Array as PropType<timer.stat.Row[]>,
        clickDisabled: Boolean,
    },
    setup(props) {
        return () => {
            const siteMap = new SiteMap<string>()
            props.modelValue?.forEach(({ siteKey, iconUrl }) => siteKey && siteMap.put(siteKey, iconUrl))

            return (
                <ElScrollbar maxHeight="400px" height="fit-content" viewStyle={{ padding: '10px 0', marginRight: '11px' }}>
                    <Flex gap={8} column>
                        {siteMap?.map((siteKey, iconUrl) => (
                            <HostAlert
                                value={siteKey}
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