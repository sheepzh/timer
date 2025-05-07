/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { type ButtonType, ElButton, ElPopconfirm } from "element-plus"
import { defineComponent } from "vue"
import { type JSX } from "vue/jsx-runtime"

type Props = {
    confirmText?: string
    buttonText?: string
    text?: boolean
    buttonType?: ButtonType
    buttonIcon?: JSX.Element
    visible?: boolean
    onConfirm?: () => void
}

const PopupConfirmButton = defineComponent<Props>(props => {
    return () => (
        <ElPopconfirm
            confirmButtonText={t(msg => msg.button.okey)}
            cancelButtonText={t(msg => msg.button.dont)}
            title={props.confirmText}
            width={300}
            onConfirm={props.onConfirm}
            v-slots={{
                reference: () => (
                    <ElButton
                        v-show={props.visible ?? true}
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
}, { props: ['buttonIcon', 'buttonText', 'buttonType', 'confirmText', 'onConfirm', 'text', 'visible'] })

export default PopupConfirmButton
