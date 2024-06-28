import CollapseCard from "@app/components/common/CollapseCard"
import ContentContainer from "@app/components/common/ContentContainer"
import { t } from "@app/locale"
import { ArrowRight, Check, Close } from "@element-plus/icons-vue"
import { useRequest, useState } from "@hooks"
import limitService from "@service/limit-service"
import { ElBreadcrumb, ElBreadcrumbItem, ElButton, ElCol, ElForm, ElFormItem, ElInput, ElOption, ElRow, ElScrollbar, ElSelect, ElSwitch } from "element-plus"
import { defineComponent } from "vue"
import { useRoute } from "vue-router"
import UrlInput from "./UrlInput"
import "./style.sass"

type Mode = "create" | "modify"

const GUTTER = 30

type RuleType = 'daily' | 'visit' | 'period'

const _default = defineComponent(() => {

    const route = useRoute()
    const id = route.params?.id as string
    const [mode] = useState<Mode>(id ? 'modify' : 'create')
    const { data } = useRequest(() => id ? limitService.get(parseInt(id)) : null)
    const [name, setName] = useState<string>()
    const [enabled, setEnabled] = useState(false)
    const [delayAllowed, setDelayAllowed] = useState(true)
    const [weekdays, setWeekdays] = useState<number[]>([])
    const [urls, setUrls] = useState<string[]>(['123', '123123', '3123'])

    return () => (
        <ContentContainer>
            <div class="limit-detail">
                {/* header */}
                <div class="header">
                    <ElBreadcrumb separatorIcon={<ArrowRight />}>
                        <ElBreadcrumbItem>{t(msg => msg.menu.limit)}</ElBreadcrumbItem>
                        <ElBreadcrumbItem>{t(msg => msg.button[mode.value])}</ElBreadcrumbItem>
                    </ElBreadcrumb>
                    <div class="button-container">
                        <ElButton type="text" icon={<Close />}>
                            {t(msg => msg.button.cancel)}
                        </ElButton>
                        <ElButton type="primary" icon={<Check />}>
                            {t(msg => msg.button.save)}
                        </ElButton>
                    </div>
                </div>
                <ElScrollbar>
                    <ElForm labelWidth={130} labelPosition="right">
                        <div class="content">
                            {/* Base Info */}
                            <CollapseCard title={t(msg => msg.limit.step.base)}>
                                <ElRow gutter={GUTTER}>
                                    <ElCol span={12}>
                                        <ElFormItem label={t(msg => msg.limit.item.name)} required>
                                            <ElInput
                                                size="small"
                                                modelValue={name.value}
                                                onInput={setName}
                                                clearable
                                                onClear={() => setName()}
                                            />
                                        </ElFormItem>
                                    </ElCol>
                                    <ElCol span={12}>
                                        <ElFormItem label={t(msg => msg.limit.item.enabled)}>
                                            <ElSwitch modelValue={enabled.value} onChange={setEnabled} />
                                        </ElFormItem>
                                    </ElCol>
                                </ElRow>
                            </CollapseCard>
                            {/* Scope */}
                            <CollapseCard title={t(msg => msg.limit.step.scope)}>
                                <ElRow gutter={GUTTER}>
                                    <ElCol span={12}>
                                        <ElFormItem label={t(msg => msg.limit.item.effectiveDay)} required>
                                            <ElSelect
                                                multiple
                                                modelValue={weekdays.value}
                                                onChange={(newVal: number[]) => setWeekdays(newVal?.sort((a, b) => a - b))}
                                                placeholder=""
                                            >
                                                {t(msg => msg.calendar.weekDays).split('|').map((weekDay, idx) => <ElOption value={idx} label={weekDay} />)}
                                            </ElSelect>
                                        </ElFormItem>
                                    </ElCol>
                                </ElRow>
                                <ElFormItem label={t(msg => msg.limit.item.condition)} required>
                                    <UrlInput modelValue={urls.value} onChange={setUrls} />
                                </ElFormItem>
                            </CollapseCard>
                            {/* Rule */}
                            <CollapseCard title={t(msg => msg.limit.step.rule)}>

                            </CollapseCard>
                        </div>
                    </ElForm>
                </ElScrollbar>
            </div>
        </ContentContainer>
    )
})

export default _default