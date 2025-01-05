import { type CSSProperties, defineComponent, h, type PropType } from "vue"

const cvtPxScale = (val: number | string): string => typeof val === 'number' ? `${val}px` : val

const _default = defineComponent({
    props: {
        direction: String as PropType<CSSProperties['flexDirection']>,
        flex: Number,
        align: String as PropType<CSSProperties['alignItems']>,
        justify: String as PropType<CSSProperties['justifyContent']>,
        gap: [String, Number],
        wrap: String as PropType<CSSProperties['flexWrap']>,
        width: [String, Number] as PropType<CSSProperties['width']>,
        height: [String, Number] as PropType<CSSProperties['height']>,
        boxSizing: String as PropType<CSSProperties['boxSizing']>,
        cursor: String as PropType<CSSProperties['cursor']>,
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
                    flexDirection: props.direction,
                    alignItems: props.align,
                    justifyContent: props.justify,
                    flexWrap: props.wrap,
                    gap: typeof props.gap === 'number' ? `${props.gap}px` : props.gap,
                    width: cvtPxScale(props.width),
                    height: cvtPxScale(props.height),
                    boxSizing: props.boxSizing,
                    cursor: props.cursor,
                    ...props.style || {},
                }}
            >
                {defaultSlots && h(defaultSlots)}
            </div>
        )
    }
})

export default _default