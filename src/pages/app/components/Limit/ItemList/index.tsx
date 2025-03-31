import { useRequest } from "@hooks"
import Box from "@pages/components/Box"
import Flex from "@pages/components/Flex"
import limitService from "@service/limit-service"
import { ElEmpty } from "element-plus"
import { defineComponent, reactive } from "vue"
import { useLimitFilter } from "../context"
import Item from "./Item"

export type ItemListInstance = {
    getSelected: () => timer.limit.Item[]
    refresh: () => void
}

type Props = {
    onModify?: ArgCallback<timer.limit.Item>
}

const ItemList = defineComponent(({ onModify }: Props, ctx) => {
    const filter = useLimitFilter()
    const selected = reactive<number[]>([])
    const handleSelectChange = (id: number, val: boolean) => {
        if (val) {
            selected.push(id)
        } else {
            let idx: number
            while ((idx = selected.findIndex(e => e === id)) !== -1) {
                selected.splice(idx, 1)
            }
        }
    }

    const { data, ts, refresh, loading } = useRequest(
        () => limitService.select({ filterDisabled: filter.value?.onlyEnabled, url: filter.value?.url || '' }),
        { defaultValue: [], deps: filter },
    )

    ctx.expose({
        refresh,
        getSelected: () => data.value?.filter(item => selected.includes(item.id)) ?? [],
    } satisfies ItemListInstance)

    return () => (
        <Flex key={ts.value} gap={40} width='100%' justify="space-between">
            {!data.value?.length && !loading.value && (
                <Flex width='100%' justify="space-around" style={{ marginTop: '60px' }}>
                    <ElEmpty
                        imageSize={150}
                        description="No rules. You can create one by clicking the top right button"
                    />
                </Flex>
            )}
            {data.value?.map(item => (
                <Box key={`${item.id}-${ts.value}`} width={450}>
                    <Item
                        value={item}
                        selected={selected.includes(item.id)}
                        onSelectChange={val => handleSelectChange(item.id, val)}
                        onDeleted={refresh}
                        onModifyClick={() => onModify?.(item)}
                    />
                </Box>
            ))}
        </Flex >
    )
}, { props: ['onModify'] })

export default ItemList