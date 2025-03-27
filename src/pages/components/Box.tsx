import { computed, type CSSProperties, defineComponent, h, useSlots } from "vue"
import { cvtPxScale } from "./common"

type Props = Pick<CSSProperties, 'minWidth' | 'maxWidth' | 'width' | 'height' | 'marginInlineEnd'>

const Box = defineComponent(
    (props: Props) => {
        const style = computed(() => ({
            width: cvtPxScale(props.width),
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
    { props: ['minWidth', 'maxWidth', 'width', 'height', 'marginInlineEnd'] }
)

export default Box