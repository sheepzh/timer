/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { Ref } from "vue"

import { computed, defineComponent } from "vue"
import PopupConfirmButton from "@app/components/common/PopupConfirmButton"
import { Delete } from "@element-plus/icons-vue"
import { t } from "@app/locale"
import { formatTime } from "@util/time"
import { cvt2LocaleTime } from "@app/util/time"
import { useReportFilter } from "../../context"

/**
 * Compute the confirm text for one item
 *
 * @param url  item url
 * @param date item date
 */
function computeSingleConfirmText(url: string, date: string): string {
    const formatDate = cvt2LocaleTime(date)
    return t(msg => msg.item.operation.deleteConfirmMsg, { url, date: formatDate })
}

function computeRangeConfirmText(url: string, dateRange: [Date, Date]): string {
    const hasDateRange = dateRange?.length === 2 && (dateRange[0] || dateRange[1])
    if (!hasDateRange) {
        // Delete all
        return t(msg => msg.item.operation.deleteConfirmMsgAll, { url })
    }
    const dateFormat = t(msg => msg.calendar.dateFormat)
    const startDate = dateRange[0]
    const endDate = dateRange[1]
    const start = formatTime(startDate, dateFormat)
    const end = formatTime(endDate, dateFormat)
    return start === end
        // Only one day
        ? computeSingleConfirmText(url, start)
        : t(msg => msg.item.operation.deleteConfirmMsgRange, { url, start, end })
}

const _default = defineComponent({
    emits: {
        confirm: () => true
    },
    props: {
        itemUrl: String,
        itemDate: String,
        visible: Boolean
    },
    setup(props, ctx) {
        const filter = useReportFilter()
        const deleteMsg: Ref<string> = computed(() => {
            const url = props.itemUrl
            return filter.value?.mergeDate
                ? computeRangeConfirmText(url, filter.value?.dateRange)
                : computeSingleConfirmText(url, props.itemDate)
        })
        return () => <PopupConfirmButton
            buttonIcon={Delete}
            buttonType="danger"
            buttonText={t(msg => msg.button.delete)}
            confirmText={deleteMsg.value}
            visible={props.visible}
            onConfirm={() => ctx.emit("confirm")}
        />
    }
})

export default _default