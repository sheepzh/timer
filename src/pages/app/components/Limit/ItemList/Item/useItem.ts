import { t } from "@app/locale"
import { useProvide, useProvider } from "@hooks/index"
import limitService from "@service/limit-service"
import { ElMessage, ElMessageBox } from "element-plus"
import { Reactive, reactive, toRaw, type Ref } from "vue"
import { verifyCanModify } from "../../common"

type Context = {
    data: Reactive<timer.limit.Item>
    selected: Ref<boolean>
    onDeleted: NoArgCallback
}

const NAME_SPACE = 'limit_item'

const ALL_FIELDS = ['enabled', 'allowDelay', 'locked'] as const

export type SwitchField = keyof timer.limit.Item & (typeof ALL_FIELDS[number])

export const provideItem = (
    value: timer.limit.Item,
    selected: Ref<boolean>,
    onDeleted: NoArgCallback
): Reactive<timer.limit.Item> => {
    const data = reactive(value)

    useProvide(NAME_SPACE, { data, selected, onDeleted } satisfies Context)

    return data
}

type BoolSetter = (val: boolean) => void

type ItemResult = Context
    & Record<'changeEnabled' | 'changeLocked' | 'changeAllowDelay', BoolSetter>
    & {
        doDelete: () => void
    }

export const useItemData = () => useProvider<Context, 'data'>(NAME_SPACE, 'data').data

export const useItem = (): ItemResult => {

    const ctx = useProvider<Context, 'data' | 'selected' | 'onDeleted'>(NAME_SPACE, 'data', 'selected', 'onDeleted')
    const { data, onDeleted } = ctx

    const changeEnabled = async (enabled: boolean) => {
        try {
            !enabled && await verifyCanModify(data)
            data.enabled = enabled
            limitService.updateEnabled(toRaw(data))
        } catch (e) {
            console.log(e)
        }
    }

    const changeLocked = (val: boolean) => {
        if (!val) {

        }
        data.locked = val
    }

    const changeAllowDelay = async (val: boolean) => {
        try {
            val && await verifyCanModify(data)
            data.allowDelay = val
            limitService.updateDelay(toRaw(data))
        } catch (e) {
            console.log(e)
        }
    }

    const doDelete = async () => {
        const raw = toRaw(data)

        try {
            await verifyCanModify(raw)
            const { cond } = raw
            const message = t(msg => msg.limit.message.deleteConfirm, { cond })
            await ElMessageBox.confirm(message, { type: "warning" })
            await limitService.remove(raw)
            ElMessage.success(t(msg => msg.operation.successMsg))
            onDeleted()
        } catch {
            /** Do nothing */
        }
    }

    return {
        ...ctx,
        changeEnabled, changeLocked, changeAllowDelay,
        doDelete,
    }
}