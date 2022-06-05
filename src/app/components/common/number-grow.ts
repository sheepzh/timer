/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h, onMounted, ref, watch } from "vue"
import { CountUp } from "countup.js"
import type { Ref } from "vue"

const _default = defineComponent({
    name: "NumberGrow",
    props: {
        value: Number,
        duration: Number,
        fontSize: Number,
    },
    emits: ['stop'],
    setup(props) {
        const elRef: Ref<HTMLElement> = ref()
        const countUp: Ref<CountUp> = ref()
        const style: Partial<CSSStyleDeclaration> = {
            textDecoration: 'underline'
        }
        props.fontSize && (style.fontSize = `${props.fontSize}px`)

        onMounted(() => {
            countUp.value = new CountUp(elRef.value, props.value, {
                startVal: 0,
                duration: props.duration || 1.5,
                separator: ',',
            })
            if (countUp.value.error) {
                console.log(countUp.value.error)
            }
            countUp.value.start()
        })

        watch(() => props.value, newVal => countUp.value?.update(newVal))

        return () => h('a', { style, ref: elRef })
    }
})

export default _default