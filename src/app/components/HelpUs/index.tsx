import { createTabAfterCurrent } from "@api/chrome/tab"
import { t } from "@app/locale"
import { Pointer } from "@element-plus/icons-vue"
import { CROWDIN_HOMEPAGE } from "@util/constant/url"
import { ElAlert, ElButton, ElCard } from "element-plus"
import { defineComponent } from "vue"
import ContentContainer from "../common/ContentContainer"
import MemberList from "./MemberList"
import ProgressList from "./ProgressList"
import "./style"

const _default = defineComponent(() => {
    return () => <ContentContainer>
        <ElCard class="help-us">
            <ElAlert type="info" title={t(msg => msg.helpUs.title)}>
                <li>{t(msg => msg.helpUs.alert.l1)}</li>
                <li>{t(msg => msg.helpUs.alert.l2)}</li>
                <li>{t(msg => msg.helpUs.alert.l3)}</li>
                <li>{t(msg => msg.helpUs.alert.l4)}</li>
            </ElAlert>
            <div class="toolbar-container">
                <ElButton
                    type="primary"
                    size="large"
                    icon={<Pointer />}
                    onClick={() => createTabAfterCurrent(CROWDIN_HOMEPAGE)}
                >
                    {t(msg => msg.helpUs.button)}
                </ElButton>
            </div>
            <ProgressList />
            <MemberList />
        </ElCard>
    </ContentContainer>
})

export default _default