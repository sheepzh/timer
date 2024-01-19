/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { ButtonType, ElButton, ElPopconfirm, IconProps } from "element-plus"
import { defineComponent, PropType, h, computed } from "vue"

const confirmButtonText = t(msg => msg.confirm.confirmMsg)
const cancelButtonText = t(msg => msg.confirm.cancelMsg)

const _default = defineComponent({
    props: {
        confirmText: String,
        buttonText: String,
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
                confirmButtonText={confirmButtonText}
                cancelButtonText={cancelButtonText}
                title={props.confirmText}
                width={300}
                onConfirm={() => ctx.emit("confirm")}
                v-slots={{
                    reference: () => (
                        <ElButton
                            v-show={props.visible}
                            size="small"
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
