/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"

import { defineComponent, ref, h } from "vue"
import { init as initTheme, toggle } from "@util/dark-mode"
import optionService from "@service/option-service"
import { ElSwitch } from "element-plus"
import { Moon, Sunrise } from "@element-plus/icons-vue"

const _default = defineComponent(() => {
    const value: Ref<boolean> = ref(initTheme())
    const handleChange = (newVal: boolean) => {
        toggle(newVal)
        value.value = newVal
    }
    // Calculate the latest mode
    optionService.isDarkMode().then(handleChange)
    return () => h(ElSwitch, {
        modelValue: value.value,
        inactiveIcon: Sunrise,
        activeIcon: Moon,
        inlinePrompt: true,
        async onChange(newVal: boolean) {
            handleChange(newVal)
            const option = await optionService.getAllOption()
            option.darkMode = newVal ? 'on' : 'off'
            optionService.setAppearanceOption(option)
        },
    })
})

export default _default