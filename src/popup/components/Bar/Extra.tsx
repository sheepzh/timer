import { createTab } from "@api/chrome/tab"
import { getLatestVersion } from "@api/version"
import { Download } from "@element-plus/icons-vue"
import { useRequest } from "@hooks/useRequest"
import { t } from "@popup/locale"
import metaService from "@service/meta-service"
import packageInfo from "@src/package"
import { IS_FIREFOX } from "@util/constant/environment"
import { IS_FROM_STORE } from "@util/constant/meta"
import { REVIEW_PAGE, UPDATE_PAGE } from "@util/constant/url"
import { ElLink, ElPopover } from "element-plus"
import { computed, defineComponent } from "vue"

const Extra = defineComponent(() => {
    const { data: latestVersion } = useRequest(getLatestVersion)

    const upgradeVisible = computed(() => latestVersion.value && packageInfo.version !== latestVersion.value && IS_FROM_STORE)

    const { data: rateVisible } = useRequest(() => metaService.recommendRate())

    const handleRateClick = async () => {
        await metaService.saveFlag("rateOpen")
        createTab(REVIEW_PAGE)
    }

    const handleUpgradeClick = () => {
        if (IS_FIREFOX) return
        createTab(UPDATE_PAGE)
    }

    return () => {
        if (upgradeVisible.value) {
            const version = packageInfo.version
            const popInfo = IS_FIREFOX ? t(msg => msg.footer.updateVersionInfo4Firefox, { version }) : t(msg => msg.footer.updateVersionInfo, { version })
            return (
                <ElPopover
                    content={popInfo}
                    effect="dark"
                    width="auto"
                    v-slots={{
                        reference: () => (
                            <ElLink
                                type="success"
                                underline={!IS_FIREFOX}
                                icon={<Download />}
                                onClick={handleUpgradeClick}
                            >
                                {t(msg => msg.footer.updateVersion)}
                            </ElLink>
                        )
                    }}
                />)
        } else if (rateVisible.value) {
            return (
                <ElLink
                    type="primary"
                    onClick={() => handleRateClick()}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-394d1fd8="" width="15px"
                            height="15px" class="el-svg-icon" style="color: var(--el-color-danger);">
                            <path fill="currentColor"
                                d="M1000 248Q976.992 192 933.984 148.992 849.984 64 732.992 64q-64 0-121.504 28T512 171.008q-42.016-51.008-99.488-79.008T291.008 64Q174.016 64 90.016 150.016 47.008 193.024 24 249.024-0.992 308.032 0 371.04q0.992 68.992 28.992 130.496t79.008 104.512q4.992 4 8.992 8 14.016 12 112.992 102.016 208 191.008 256.992 235.008 11.008 8.992 24.992 8.992t24.992-8.992q32.992-30.016 180.992-164.992 158.016-144 196-179.008 52-43.008 80.992-104.992t28.992-132q0-64-24-122.016z">
                            </path>
                        </svg>
                    }
                >
                    {t(msg => msg.footer.rate)}
                </ElLink>
            )
        }
    }
})

export default Extra