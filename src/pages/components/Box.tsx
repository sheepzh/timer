import { computed, type CSSProperties, defineComponent, h, type PropType, useSlots } from "vue"
import { cvtPxScale } from "./common"

const Box = defineComponent({
    props: {
        minWidth: [String, Number] as PropType<CSSProperties['minWidth']>,
        maxWidth: [String, Number] as PropType<CSSProperties['maxWidth']>,
        height: [String, Number] as PropType<CSSProperties['height']>,
        marginInlineEnd: String as PropType<CSSProperties['marginInlineEnd']>,
    },
    setup(props) {
        const style = computed(() => ({
            minWidth: cvtPxScale(props.minWidth),
            maxWidth: cvtPxScale(props.maxWidth),
            height: cvtPxScale(props.height),
            marginInlineEnd: cvtPxScale(props.marginInlineEnd),
        } satisfies CSSProperties))

        const { default: content } = useSlots()

        return () => (
            <div style={style.value}>
                {!!content && h(content)}
            </div>
        )
    },
})

export default Box