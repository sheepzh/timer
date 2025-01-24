/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useCategories } from "@app/context"
import { t } from "@app/locale"
import Flex from "@pages/components/Flex"
import siteService from "@service/site-service"
import { computedAsync } from "@vueuse/core"
import { ElTag } from "element-plus"
import { computed, defineComponent, type PropType, type StyleValue, toRef } from "vue"
import { useAnalysisTarget } from "../../context"
import { labelOfHostInfo } from "../../util"

const TITLE_STYLE: StyleValue = {
    fontSize: '26px',
    marginBlockStart: '.2em',
    marginBlockEnd: '.4em',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
}

const SUBTITLE_STYLE: StyleValue = {
    fontSize: '14px',
    color: 'var(--el-text-color-secondary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    margin: 0,
}

const SiteInfo = defineComponent({
    props: {
        value: Object as PropType<timer.site.SiteKey>,
    },
    setup(props) {
        const key = toRef(props, 'value')
        const site = computedAsync(() => key.value ? siteService.get(key.value) : undefined)
        const iconUrl = computed(() => site.value?.iconUrl)
        const title = computed(() => site.value?.alias ?? labelOfHostInfo(site.value))
        const subtitle = computed(() => site.value?.alias ? labelOfHostInfo(site.value) : undefined)

        return () => (
            <Flex width="100%" column align="center">
                <img v-show={!!iconUrl.value} src={iconUrl.value} width={24} height={24} />
                <h1 style={TITLE_STYLE}>{title.value}</h1>
                {subtitle && <p style={SUBTITLE_STYLE}>{subtitle.value}</p>}
            </Flex>
        )
    },
})

const CateInfo = defineComponent({
    props: {
        value: Number,
    },
    setup(props) {
        const cateId = toRef(props, 'value')
        const { categories } = useCategories()
        const cate = computed(() => categories.value?.find(c => c.id === cateId.value))

        return () => (
            <Flex width="100%" gap={5} column align="center">
                <h1 style={TITLE_STYLE}>{cate.value?.name}</h1>
                <ElTag type='info' size="small">{t(msg => msg.analysis.target.cate)}</ElTag>
            </Flex>
        )
    },
})

const TargetInfo = defineComponent({
    setup: () => {
        const target = useAnalysisTarget()
        return () => (
            <Flex
                align="center"
                justify="center"
                minHeight={140}
                boxSizing="border-box"
                padding="0 25px"
            >
                {!target.value && <h1 style={TITLE_STYLE}>{t(msg => msg.analysis.common.emptyDesc)}</h1>}
                {target.value?.type === 'site' && <SiteInfo value={target.value?.key} />}
                {target.value?.type === 'cate' && <CateInfo value={target.value?.key} />}
            </Flex>
        )
    }
})

export default TargetInfo
