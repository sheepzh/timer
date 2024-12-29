import Flex from "@src/pages/components/Flex"
import { t } from "@src/pages/popup/locale"
import { ElText } from "element-plus"
import { defineComponent } from "vue"

const Header = defineComponent(() => {
    return () => (
        <Flex>
            <ElText size="large" tag="b">
                {t(msg => msg.meta.name)}
            </ElText>
        </Flex>
    )
})

export default Header