import optionHolder from "@service/components/option-holder"
import optionService from "@service/option-service"
import { defaultBackup } from "@util/constant/option"
import { computed, onBeforeMount, type Ref, ref, toRaw, watch } from "vue"

type Result = {
    reset: () => void
    backupType: Ref<timer.backup.Type>
    clientName: Ref<string>
    autoBackUp: Ref<boolean>
    autoBackUpInterval: Ref<number | undefined>
    auth: Ref<string | undefined>
    account: Ref<string | undefined>
    password: Ref<string | undefined>
    ext: Ref<timer.backup.TypeExt | undefined>
    setExtField: (field: keyof timer.backup.TypeExt, val: string) => void
}

export const useOptionState = (): Result => {
    const defaultOption = defaultBackup()
    const backupType = ref(defaultOption.backupType)
    const autoBackUp = ref(defaultOption.autoBackUp)
    const autoBackUpInterval = ref(defaultOption.autoBackUpInterval)
    const backupExts = ref(defaultOption.backupExts)
    const backupAuths = ref(defaultOption.backupAuths)
    const clientName = ref(defaultOption.clientName)
    const login = ref(defaultOption.backupLogin)

    watch([
        backupType,
        autoBackUp, autoBackUpInterval,
        backupExts, backupAuths, login,
        clientName,
    ], () => optionService.setBackupOption({
        backupType: backupType.value,
        autoBackUp: autoBackUp.value,
        autoBackUpInterval: autoBackUpInterval.value,
        backupExts: toRaw(backupExts.value),
        backupAuths: toRaw(backupAuths.value),
        clientName: clientName.value,
        backupLogin: toRaw(login.value),
    }))

    onBeforeMount(async () => {
        const val = await optionHolder.get()
        backupType.value = val?.backupType
        autoBackUp.value = val?.autoBackUp
        autoBackUpInterval.value = val?.autoBackUpInterval
        backupExts.value = val?.backupExts
        backupAuths.value = val?.backupAuths
        clientName.value = val?.clientName
        login.value = val?.backupLogin
    })

    const reset = () => {
        // Only reset type and auto flag
        backupType.value = defaultOption.backupType
        autoBackUp.value = defaultOption.autoBackUp
    }

    const auth = computed({
        get: () => backupAuths.value?.[backupType?.value],
        set: val => {
            const typeVal = backupType.value
            if (!typeVal) return
            const newAuths = {
                ...backupAuths.value || {},
                [typeVal]: val,
            }
            backupAuths.value = newAuths
        }
    })

    const ext = computed<timer.backup.TypeExt | undefined>({
        get: () => backupExts.value?.[backupType.value],
        set: val => {
            const typeVal = backupType.value
            if (!typeVal) return
            const newExts = {
                ...backupExts.value || {},
                [typeVal]: val,
            }
            backupExts.value = newExts
        },
    })

    const setExtField = (field: keyof timer.backup.TypeExt, val: string) => {
        const newVal = { ...(ext.value || {}), [field]: val?.trim?.() }
        ext.value = newVal
    }

    const setLoginField = (field: keyof timer.backup.LoginInfo, val: string) => {
        const typeVal = backupType.value
        if (!typeVal) return
        const newLogin = {
            ...login.value || {},
            [typeVal]: { ...(login.value?.[typeVal] || {}), [field]: val }
        }
        login.value = newLogin
    }

    const account = computed<string | undefined>({
        get: () => login.value?.[backupType?.value]?.acc,
        set: (val: string | undefined) => setLoginField('acc', val ?? '')
    })

    const password = computed<string | undefined>({
        get: () => login.value?.[backupType?.value]?.psw,
        set: (val: string | undefined) => setLoginField('psw', val ?? '')
    })

    return {
        backupType, clientName, reset,
        autoBackUp, autoBackUpInterval,
        auth, account, password,
        ext, setExtField,
    }
}
