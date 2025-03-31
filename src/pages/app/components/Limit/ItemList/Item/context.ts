import { t } from "@app/locale"
import { useProvide, useProvider } from "@hooks/index"
import limitService from "@service/limit-service"
import { ElMessage, ElMessageBox } from "element-plus"
import { Reactive, toRaw, type Ref } from "vue"
import { verifyCanModify } from "../../common"

type Option = {
    data: Reactive<timer.limit.Item>
    selected: Ref<boolean>
    onDeleted: NoArgCallback
    onModify: NoArgCallback
}

type ItemContext = Pick<Option, 'data' | 'selected'>
    & Record<'changeEnabled' | 'changeLocked' | 'changeAllowDelay', ArgCallback<boolean>>
    & Record<'doDelete' | 'doModify', NoArgCallback>

const NAME_SPACE = 'limit_item'

const ALL_FIELDS = ['enabled', 'allowDelay', 'locked'] as const

export type SwitchField = keyof timer.limit.Item & (typeof ALL_FIELDS[number])

export const provideItem = (option: Option): void => {
    const {
        data, selected,
        onDeleted, onModify
    } = option

    const changeEnabled = async (enabled: boolean) => {
        try {
            (data.locked || !enabled) && await verifyCanModify(data)
            data.enabled = enabled
            limitService.updateEnabled(toRaw(data))
        } catch (e) {
            console.log(e)
        }
    }

    const changeLocked = async (locked: boolean) => {
        try {
            if (locked) {
                const message = t(msg => msg.limit.message.lockConfirm)
                await ElMessageBox.confirm(message, { type: "warning" })
            } else {
                await verifyCanModify(data)
            }
            data.locked = locked
            limitService.updateLocked(toRaw(data))
        } catch (e) {
            console.log(e)
        }
    }

    const changeAllowDelay = async (val: boolean) => {
        try {
            (data.locked || val) && await verifyCanModify(data)
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
        } catch (e) {
            console.error("Error occurred when deleting limit rule", e)
        }
    }

    const doModify = async () => {
        const raw = toRaw(data)
        try {
            await verifyCanModify(raw)
            onModify()
        } catch {
            /** Do nothing */
        }
    }

    const context: ItemContext = {
        data, selected,
        changeEnabled, changeLocked, changeAllowDelay,
        doDelete: () => setTimeout(doDelete),
        doModify: () => setTimeout(doModify),
    }

    useProvide(NAME_SPACE, context)
}

export const useItem = () => useProvider<ItemContext, 'data'>(NAME_SPACE, 'data').data

const HEADER_KEYS: (keyof ItemContext)[] = [
    'data', 'selected',
    'changeEnabled', 'changeLocked', 'changeAllowDelay',
    'doDelete', 'doModify',
] as const
type HeaderKey = typeof HEADER_KEYS[number]

export const useHeader = () => useProvider<ItemContext, HeaderKey>(NAME_SPACE, ...HEADER_KEYS)
