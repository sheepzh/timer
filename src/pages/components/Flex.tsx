import { type CSSProperties, defineComponent, h, useSlots } from "vue"
import { ALL_BASE_PROPS, type BaseProps, cvt2BaseStyle } from "./common"

const cvtFlexWrap = (wrap: boolean | CSSProperties['flexWrap']): CSSProperties['flexWrap'] => {
    if (typeof wrap === 'string') return wrap
    if (wrap === true) return 'wrap'
    return undefined
}

type Props = {
    direction?: CSSProperties['flexDirection']
    column?: boolean
    flex?: number
    align?: CSSProperties['alignItems']
    justify?: CSSProperties['justifyContent']
    gap?: string | number
    wrap?: CSSProperties['flexWrap'] | boolean
} & BaseProps

const Flex = defineComponent<Props>(props => {
    const { default: defaultSlots } = useSlots()

    return () => (
        <div
            id={props.id}
            class={props.class}
            onClick={props.onClick}
            style={{
                display: props.inline ? 'inline-flex' : 'flex',
                flex: props.flex,
                flexDirection: props?.column ? 'column' : props.direction,
                alignItems: props.align,
                justifyContent: props.justify,
                flexWrap: cvtFlexWrap(props.wrap),
                gap: typeof props.gap === 'number' ? `${props.gap}px` : props.gap,
                ...cvt2BaseStyle(props),
            }}
        >
            {defaultSlots && h(defaultSlots)}
        </div>
    )
}, { props: [...ALL_BASE_PROPS, 'direction', 'column', 'flex', 'align', 'justify', 'gap', 'wrap'] })

export default Flex