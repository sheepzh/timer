import { CSSProperties, defineComponent, h, PropType } from "vue"

const _default = defineComponent({
    props: {
        direction: String as PropType<CSSProperties['flexDirection']>,
        align: String as PropType<CSSProperties['alignItems']>,
        justify: String as PropType<CSSProperties['justifyContent']>,
        gap: [String, Number],
        wrap: String as PropType<CSSProperties['flexWrap']>,
        width: [String, Number] as PropType<CSSProperties['width']>,
        height: [String, Number] as PropType<CSSProperties['height']>,
        style: Object as PropType<CSSProperties>,
    },
    emits: {
        click: () => true,
    },
    setup(props, ctx) {
        return () => (
            <div
                onClick={() => ctx.emit('click')}
                style={{
                    display: 'flex',
                    flexDirection: props.direction,
                    alignItems: props.align,
                    justifyContent: props.justify,
                    flexWrap: props.wrap,
                    gap: typeof props.gap === 'number' ? `${props.gap}px` : props.gap,
                    ...props.style || {},
                }}
            >
                {h(ctx.slots.default)}
            </div>
        )
    }
})

export default _default