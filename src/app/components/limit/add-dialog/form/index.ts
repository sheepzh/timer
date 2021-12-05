/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElForm } from "element-plus"
import { computed, ComputedRef, defineComponent, h, ref, Ref, SetupContext } from "vue"
import '../style/el-input'
import pathEdit from "./path-edit"
import timeFormItem from "./time-limit"
import urlFormItem, { FormUrlProps, Protocol } from "./url"
import UrlPathItem from "./url-path-item"

// Limited time
const hourRef: Ref<number> = ref()
const minuteRef: Ref<number> = ref()
const secondRef: Ref<number> = ref()

// Limited url
const protocolRef: Ref<string> = ref()
const pathItemsRef: Ref<UrlPathItem[]> = ref([])
const urlRef: ComputedRef<string> = computed(() => pathItemsRef.value.map(i => i.toString()).join('/'))

const timeProps = { hourRef, minuteRef, secondRef }
const urlProps: FormUrlProps = { protocolRef, pathItemsRef, urlRef }
const pathEditProps = { pathItemsRef }
const render = () => h(ElForm,
    { labelWidth: '100px' },
    () => [timeFormItem(timeProps), urlFormItem(urlProps), pathEdit(pathEditProps)]
)

function init() {
    hourRef.value = 1
    minuteRef.value = undefined
    secondRef.value = undefined
    protocolRef.value = Protocol.ALL
    pathItemsRef.value = []
}

init()

export type FormData = {
    /**
     * Time / seconds
     */
    timeLimit: number
    /**
     * Protocol + url
     */
    url: string
}

const handleGetData = () => {
    let timeLimit = 0
    timeLimit += (hourRef.value || 0) * 3600
    timeLimit += (minuteRef.value || 0) * 60
    timeLimit += (secondRef.value || 0)
    const url = urlRef.value || ''
    const protocol = protocolRef.value
    const result: FormData = {
        timeLimit,
        url: url ? protocol + url : ''
    }
    return result
}

const exposeOption = {
    getData: () => handleGetData(),
    clean: () => init()
}

const _default = defineComponent({
    setup: (_, context: SetupContext) => context.expose(exposeOption),
    render
})

export default _default