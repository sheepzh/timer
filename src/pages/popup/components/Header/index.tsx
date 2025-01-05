import { createTab } from "@api/chrome/tab"
import { View } from "@element-plus/icons-vue"
import Flex from "@pages/components/Flex"
import LangSelect from "@popup/components/Header/LangSelect"
import { t } from "@popup/locale"
import { getAppPageUrl } from "@util/constant/url"
import { ElLink } from "element-plus"
import { defineComponent } from "vue"
import DarkSwitch from "./DarkSwitch"
import Extra from "./Extra"
import Github from "./Github"
import Logo from "./Logo"
import Option from "./Option"

const Header = defineComponent(() => {

    const handleAllFuncClick = () => createTab(getAppPageUrl(false, '/'))

    return () => (
        <Flex justify="space-between" style={{ padding: '0 10px', color: 'var(--el-text-color-primary)' }}>
            <Logo />
            <Flex gap={10}>
                <Flex gap={10}>
                    <Extra />
                    <ElLink
                        underline={false}
                        onClick={handleAllFuncClick}
                        icon={<View />}
                        style={{ gap: '3px' }}
                    >
                        {t(msg => msg.base.allFunction)}
                    </ElLink>
                </Flex>
                <Flex align="center" gap={8} style={{ fontSize: '30px' }}>
                    <LangSelect />
                    <DarkSwitch />
                    <Option />
                    <Github />
                </Flex>
            </Flex>
        </Flex >
    )
})

export default Header