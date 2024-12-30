import { I18nKey, tN } from "@app/locale"
import { PropType, VNode, defineComponent } from "vue"

const _default = defineComponent({
    props: {
        path: {
            type: Function as PropType<I18nKey>,
            required: true,
        },
        param: Object as PropType<Record<string, string | VNode | number>>,
    },
    setup: props => {
        return () => <>
            {
                ...tN(props.path, props.param)
            }
        </>
    }
})

export default _default