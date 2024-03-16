import type { HelpUsMessage } from "@i18n/message/app/help-us"

import { ElAlert, ElButton, ElCard } from "element-plus"
import { defineComponent } from "vue"
import ContentContainer from "../common/content-container"
import ProgressList from "./ProgressList"
import MemberList from "./MemberList"
import { t } from "@app/locale"
import "./style"
import { Pointer } from "@element-plus/icons-vue"
import { createTabAfterCurrent } from "@api/chrome/tab"
import { CROWDIN_HOMEPAGE } from "@util/constant/url"

const alertKeys: (keyof HelpUsMessage['alert'])[] = ["l1", "l2", "l3", "l4"]

const _default = defineComponent({
    render: () => <ContentContainer>
        <ElCard class="help-us">
            <ElAlert type="info" title={t(msg => msg.helpUs.title)}>
                {alertKeys.map(key => <li>{t(msg => msg.helpUs.alert[key])}</li>)}
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