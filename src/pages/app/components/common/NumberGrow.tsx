/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getNumberSeparator } from "@i18n"
import { CountUp } from "countup.js"
import { defineComponent, onMounted, ref, watch, type Ref, type StyleValue } from "vue"

const _default = defineComponent({
    props: {
        value: {
            type: Number,
            required: true,
        },
        duration: Number,
        fontSize: Number,
    },
    setup(props) {
        const el: Ref<HTMLElement | undefined> = ref()
        const countUp: Ref<CountUp | undefined> = ref()
        const style: StyleValue = {
            textDecoration: 'underline'
        }
        props.fontSize && (style.fontSize = `${props.fontSize}px`)

        onMounted(() => {
            const countEl = el.value
            if (!countEl) return
            countUp.value = new CountUp(countEl, props.value, {
                startVal: 0,
                duration: props.duration || 1.5,
                separator: getNumberSeparator(),
            })
            if (countUp.value.error) {
                console.log(countUp.value.error)
            }
            countUp.value.start()
        })

        watch(() => props.value, newVal => countUp.value?.update(newVal))

        return () => <a style={style} ref={el} />
    }
})

export default _default