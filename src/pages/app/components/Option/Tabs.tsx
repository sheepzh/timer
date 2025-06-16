import { t } from "@app/locale"
import { Download, Refresh, Upload } from "@element-plus/icons-vue"
import { ElIcon, ElMessage, ElTabPane, ElTabs, TabPaneName } from "element-plus"
import { defineComponent, h, ref, useSlots } from "vue"
import { useRouter } from "vue-router"
import ContentContainer from "../common/ContentContainer"
import { CATE_LABELS, changeQuery, type OptionCategory, parseQuery } from "./common"
import { exportSettings, importSettings, createFileInput } from "./export-import"

const resetButtonName = "reset"
const exportButtonName = "export"
const importButtonName = "import"

const _default = defineComponent({
    emits: {
        reset: (_cate: OptionCategory, _callback: () => void) => Promise.resolve(true),
    },
    setup: (_, ctx) => {
        const tab = ref(parseQuery() || 'appearance')
        const router = useRouter()

        const handleBeforeLeave = async (activeName: TabPaneName, oldActiveName: TabPaneName): Promise<boolean> => {
            if (activeName === resetButtonName) {
                const cate: OptionCategory = oldActiveName as OptionCategory
                await new Promise<void>(res => ctx.emit('reset', cate, res))
                ElMessage.success(t(msg => msg.option.resetSuccess))
                return Promise.reject()
            } else if (activeName === exportButtonName) {
                try {
                    await exportSettings()
                    ElMessage.success(t(msg => msg.option.exportSuccess))
                } catch (error) {
                    ElMessage.error('Export failed: ' + (error as Error).message)
                }
                return Promise.reject()
            } else if (activeName === importButtonName) {
                try {
                    const fileContent = await createFileInput()
                    await importSettings(fileContent)
                    ElMessage.success(t(msg => msg.option.importSuccess))
                    // Reload the page to reflect the imported settings
                    window.location.reload()
                } catch (error) {
                    const errorMessage = (error as Error).message
                    if (errorMessage === 'File selection cancelled' || errorMessage === 'No file selected') {
                        // User cancelled, don't show error message
                    } else {
                        ElMessage.error(t(msg => msg.option.importError))
                    }
                }
                return Promise.reject()
            }
            // Change the query of current route
            changeQuery(activeName as OptionCategory, router)
            return true
        }
        return () => (
            <ContentContainer>
                <ElTabs
                    modelValue={tab.value}
                    type="border-card"
                    beforeLeave={handleBeforeLeave}
                    class="option-tab"
                >
                    {Object.entries(useSlots()).filter(([key]) => key !== 'default').map(([key, slot]) => (
                        <ElTabPane name={key} label={t(CATE_LABELS[key as OptionCategory])}>
                            {!!slot && h(slot)}
                        </ElTabPane>
                    ))}
                    <ElTabPane
                        name={resetButtonName}
                        v-slots={{
                            label: () => (
                                <div>
                                    <ElIcon>
                                        <Refresh />
                                    </ElIcon>
                                    {t(msg => msg.option.resetButton)}
                                </div>
                            )
                        }}
                    />
                    <ElTabPane
                        name={exportButtonName}
                        v-slots={{
                            label: () => (
                                <div>
                                    <ElIcon>
                                        <Download />
                                    </ElIcon>
                                    {t(msg => msg.option.exportButton)}
                                </div>
                            )
                        }}
                    />
                    <ElTabPane
                        name={importButtonName}
                        v-slots={{
                            label: () => (
                                <div>
                                    <ElIcon>
                                        <Upload />
                                    </ElIcon>
                                    {t(msg => msg.option.importButton)}
                                </div>
                            )
                        }}
                    />
                </ElTabs>
            </ContentContainer>
        )
    }
})

export default _default