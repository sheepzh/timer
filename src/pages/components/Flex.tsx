import { type CSSProperties, defineComponent, h, type PropType } from "vue"
import { cvtPxScale } from "./common"

const cvtFlexWrap = (wrap: boolean | CSSProperties['flexWrap']): CSSProperties['flexWrap'] => {
    if (typeof wrap === 'string') return wrap
    if (wrap === true) return 'wrap'
    return undefined
}

const Flex = defineComponent({
    props: {
        direction: String as PropType<CSSProperties['flexDirection']>,
        column: Boolean,
        flex: Number,
        align: String as PropType<CSSProperties['alignItems']>,
        justify: String as PropType<CSSProperties['justifyContent']>,
        gap: [String, Number],
        wrap: [String, Boolean] as PropType<CSSProperties['flexWrap'] | boolean>,
        width: [String, Number] as PropType<CSSProperties['width']>,
        height: [String, Number] as PropType<CSSProperties['height']>,
        boxSizing: String as PropType<CSSProperties['boxSizing']>,
        cursor: String as PropType<CSSProperties['cursor']>,
        maxWidth: [String, Number] as PropType<CSSProperties['maxWidth']>,
        padding: [String, Number] as PropType<CSSProperties['padding']>,
        style: Object as PropType<CSSProperties>,
        id: String,
        class: [String, Array] as PropType<string | string[]>,
    },
    emits: {
        click: (_ev: MouseEvent) => true,
    },
    setup(props, ctx) {
        const { default: defaultSlots } = ctx.slots

        return () => (
            <div
                id={props.id}
                class={props.class}
                onClick={ev => ctx.emit('click', ev)}
                style={{
                    display: 'flex',
                    flex: props.flex,
                    flexDirection: props?.column ? 'column' : props.direction,
                    alignItems: props.align,
                    justifyContent: props.justify,
                    flexWrap: cvtFlexWrap(props.wrap),
                    gap: typeof props.gap === 'number' ? `${props.gap}px` : props.gap,
                    width: cvtPxScale(props.width),
                    height: cvtPxScale(props.height),
                    boxSizing: props.boxSizing,
                    cursor: props.cursor,
                    maxWidth: cvtPxScale(props.maxWidth),
                    padding: cvtPxScale(props.padding),
                    ...props.style || {},
                }}
            >
                {defaultSlots && h(defaultSlots)}
            </div>
        )
    }
})

export default Flex