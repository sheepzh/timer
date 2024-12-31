import LangSelect from "@popup/components/Header/LangSelect"
import { t } from "@popup/locale"
import Flex from "@src/pages/components/Flex"
import { ElDivider, ElText } from "element-plus"
import { defineComponent } from "vue"
import DarkSwitch from "./DarkSwitch"
import Github from "./Github"

const Header = defineComponent(() => {
    return () => (
        <Flex justify="space-between" style={{ padding: '0 10px', color: 'var(--el-text-color-primary)' }}>
            <Flex gap={10} height={30}>
                <img src="/static/images/icon.png" style={{ height: '100%' }} />
                <ElText size="large" tag="b" style={{ color: 'var(--el-text-color-primary)' }}>
                    {t(msg => msg.meta.name)}
                </ElText>
            </Flex>
            <Flex align="center" gap={8} style={{ fontSize: '30px' }}>
                <LangSelect />
                <DarkSwitch />
                <Github />
            </Flex>
        </Flex >
    )
})

export default Header