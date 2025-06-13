import { t } from "@app/locale"
import { useTabGroups } from "@hooks/useTabGroups"
import { type ElTableRowScope } from "@pages/element-ui/table"
import { isGroup } from "@util/stat"
import { ElTableColumn, ElTag } from "element-plus"
import { defineComponent, StyleValue } from "vue"

export const cvtTagColor = (color?: `${chrome.tabGroups.Color}`): string => {
    switch (color) {
        case 'grey': return '#5F6369'
        case 'blue': return '#1974E8'
        case 'yellow': return '#F9AB03'
        case 'red': return '#DA3025'
        case 'green': return '#198139'
        case 'pink': return '#D01984'
        case 'purple': return '#A143F5'
        case 'cyan': return '#027B84'
        case 'orange': return '#FA913E'
        default: return '#000'
    }
}

const GroupColumn = defineComponent(() => {
    const { groupMap } = useTabGroups()

    return () => (
        <ElTableColumn
            align="center"
            label={t(msg => msg.item.group)}
            width={140}
            v-slots={({ row }: ElTableRowScope<timer.stat.Row>) => {
                if (!isGroup(row)) return
                const { groupKey } = row
                const { color, title } = groupMap.value[groupKey] ?? {}
                return (
                    <ElTag
                        style={{
                            backgroundColor: cvtTagColor(color),
                            color: 'var(--el-text-primary-color)',
                        } satisfies StyleValue}
                    >
                        {title ?? `ID: ${groupKey}`}
                    </ElTag>
                )
            }}
        />
    )
})

export default GroupColumn