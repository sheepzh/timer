/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref, StyleValue } from "vue"

import { defineComponent, onMounted, ref, watch } from "vue"
import { CountUp } from "countup.js"
import { getNumberSeparator } from "@i18n"

const _default = defineComponent({
    props: {
        value: Number,
        duration: Number,
        fontSize: Number,
    },
    setup(props) {
        const el: Ref<HTMLElement> = ref()
        const countUp: Ref<CountUp> = ref()
        const style: StyleValue = {
            textDecoration: 'underline'
        }
        props.fontSize && (style.fontSize = `${props.fontSize}px`)

        onMounted(() => {
            countUp.value = new CountUp(el.value, props.value, {
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