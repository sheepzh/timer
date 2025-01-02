import { createTab } from "@api/chrome/tab"
import { OPTION_ROUTE } from "@app/router/constants"
import Flex from "@pages/components/Flex"
import { getAppPageUrl } from "@util/constant/url"
import { ElIcon } from "element-plus"
import { defineComponent } from "vue"

const Option = defineComponent(() => {
    const handleClick = () => createTab(getAppPageUrl(false, OPTION_ROUTE, { i: 'popup' }))

    return () => (
        <Flex onClick={handleClick}>
            <ElIcon
                size="large"
                color="var(--el-text-color-primary)"
                style={{ cursor: 'pointer' }}
            >
                <svg viewBox="0 0 1024 1024">
                    <path d="M800 32H224a192 192 0 0 0-192 192v576a192 192 0 0 0 192 192h576a192 192 0 0 0 192-192V224a192 192 0 0 0-192-192zM189.76 367.04A128 128 0 0 1 436.8 320h315.2a48 48 0 0 1 0 96h-315.84a128 128 0 0 1-246.08-48.96z m516.16 417.92A128 128 0 0 1 587.2 704H272a48 48 0 0 1 0-96h315.84a128 128 0 1 1 118.08 176.96z" />
                </svg>
            </ElIcon>
        </Flex>
    )
})

export default Option