/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { ButtonType, ElButton, ElPopconfirm, IconProps } from "element-plus"
import { defineComponent, PropType } from "vue"

const _default = defineComponent({
    props: {
        confirmText: String,
        buttonText: String,
        text: Boolean,
        buttonType: String as PropType<ButtonType>,
        buttonIcon: Object as PropType<IconProps>,
        visible: {
            type: Boolean,
            default: true,
        }
    },
    emits: {
        confirm: () => true,
    },
    setup(props, ctx) {
        return () => (
            <ElPopconfirm
                confirmButtonText={t(msg => msg.button.okey)}
                cancelButtonText={t(msg => msg.button.dont)}
                title={props.confirmText}
                width={300}
                onConfirm={() => ctx.emit("confirm")}
                v-slots={{
                    reference: () => (
                        <ElButton
                            v-show={props.visible}
                            size="small"
                            text={props.text}
                            type={props.buttonType}
                            icon={props.buttonIcon}
                        >
                            {props.buttonText}
                        </ElButton>
                    )
                }}
            />
        )
    }
})

export default _default
