/**
 * Copyright (c) 2023 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t, tN } from "@app/locale"
import { ElInputNumber, ElSwitch } from "element-plus"
import { defineComponent, ref, watch, h } from "vue"
import localeMessages from "@i18n/message/common/locale"
import { locale } from "@i18n"

const _default = defineComponent({
    name: 'BackUpAutoInput',
    props: {
        autoBackup: Boolean,
        interval: Number
    },
    emits: {
        change: (_autoBackUp: boolean, _interval: number) => true
    },
    setup(props, ctx) {
        const autoBackUp = ref(props.autoBackup)
        const interval = ref(props.interval)
        watch(() => props.autoBackup, newVal => autoBackUp.value = newVal)
        watch(() => props.interval, newVal => interval.value = newVal)

        const handleChange = () => ctx.emit('change', autoBackUp.value, interval.value)

        return () => {
            const result = [
                h(ElSwitch, {
                    modelValue: autoBackUp.value,
                    onChange: (newVal: boolean) => {
                        autoBackUp.value = newVal
                        handleChange()
                    }
                }),
                ' ' + t(msg => msg.option.backup.auto.label),
            ]
            autoBackUp.value && result.push(
                localeMessages[locale].comma || ' ',
                ...tN(msg => msg.option.backup.auto.interval, {
                    input: h(ElInputNumber, {
                        min: 10,
                        size: 'small',
                        modelValue: interval.value,
                        onChange(newVal) {
                            interval.value = newVal
                            handleChange()
                        },
                    })
                })
            )
            return result
        }
    },
})

export default _default