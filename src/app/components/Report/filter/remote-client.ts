/**
 * Copyright (c) 2022-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"

import { t } from "@app/locale"
import { UploadFilled } from "@element-plus/icons-vue"
import { ElButton, ElIcon, ElTooltip } from "element-plus"
import { defineComponent, ref, h, watch } from "vue"

const _default = defineComponent({
    name: "ClientSelect",
    emits: {
        change: (_readRemote: boolean) => true
    },
    props: {
        visible: Boolean
    },
    setup(props, ctx) {
        const button = ref()
        const style: Ref<Partial<CSSStyleDeclaration>> = ref({ display: 'none' })
        watch(() => props.visible, visibe => style.value = { display: visibe ? 'inline-flex' : 'none' })
        const readRemote = ref(false)
        return () => h(ElTooltip, {
            trigger: 'hover',
            placement: 'bottom-start',
            effect: 'dark',
            content: t(msg => msg.report.remoteReading[readRemote.value ? 'on' : 'off'])
        }, () => h(ElButton, {
            size: 'small',
            ref: button.value,
            style: style.value,
            type: readRemote.value ? 'primary' : '',
            class: 'export-dropdown-button',
            onClick() {
                readRemote.value = !readRemote.value
                ctx.emit('change', readRemote.value)
            }
        },
            () => h(ElIcon, { size: 17, style: { padding: '0 1px' } }, () => h(UploadFilled))
        ))
    }
})

export default _default