/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElForm } from "element-plus"
import { computed, ComputedRef, defineComponent, h, reactive, ref, Ref, UnwrapRef } from "vue"
import '../style/el-input'
import LimitPathEdit from "./path-edit"
import LimitUrlFormItem from "./url"
import LimitTimeFormItem from "./time-limit"
import { parseUrl } from "./common"

function computeFormInfo(urlInfo: UrlInfo, timeRef: Ref<number>): FormInfo {
    const { url, protocol } = urlInfo
    const result: FormInfo = {
        timeLimit: timeRef.value || 0,
        condition: url ? protocol + url : ''
    }
    return result
}

function init(timeRef: Ref<number>, urlInfo: UrlInfo) {
    // 1 hour
    timeRef.value = 3600
    urlInfo.protocol = '*://'
    urlInfo.url = ''
}

function parseRow(row: timer.limit.Item, timeRef: Ref<number>, urlInfo: UrlInfo) {
    const { cond, time } = row
    timeRef.value = time || 0
    const { protocol, url } = parseUrl(cond)
    urlInfo.url = url
    urlInfo.protocol = protocol
}

const _default = defineComponent({
    name: "LimitForm",
    setup(_, ctx) {
        // Limited time
        const timeRef: Ref<number> = ref()
        // Limited url
        const urlInfo: UnwrapRef<UrlInfo> = reactive({
            protocol: undefined,
            url: undefined
        })
        const editMode: Ref<Mode> = ref('create')
        init(timeRef, urlInfo)

        const formInfo: ComputedRef<FormInfo> = computed(() => computeFormInfo(urlInfo, timeRef))
        const canEditUrl: ComputedRef<boolean> = computed(() => editMode.value === 'create')
        const pathEditRef: Ref = ref()

        function setUrl(newUrl: string) {
            urlInfo.url = newUrl
            pathEditRef?.value?.forceUpdateUrl?.(newUrl)
        }

        ctx.expose({
            getData: () => formInfo.value,
            clean: () => {
                editMode.value = 'create'
                init(timeRef, urlInfo)
            },
            modify: (row: timer.limit.Item) => {
                editMode.value = 'modify'
                parseRow(row, timeRef, urlInfo)
                setUrl(urlInfo.url)
            },
        })

        return () => h(ElForm,
            { labelWidth: 120 },
            () => {
                const items = [
                    h(LimitTimeFormItem, {
                        modelValue: timeRef.value,
                        onChange: (newVal: number) => timeRef.value = newVal
                    }),
                    h(LimitUrlFormItem, {
                        url: urlInfo.url,
                        protocol: urlInfo.protocol,
                        disabled: !canEditUrl.value,
                        onUrlChange: (newUrl: string) => setUrl(newUrl),
                        onProtocolChange: (newProtocol: Protocol) => urlInfo.protocol = newProtocol
                    }),
                ]
                canEditUrl.value && items.push(
                    h(LimitPathEdit, {
                        ref: pathEditRef,
                        disabled: editMode.value === 'modify',
                        url: urlInfo.url,
                        onUrlChange: (newVal: string) => urlInfo.url = newVal
                    })
                )
                return items
            }
        )
    }
})

export default _default