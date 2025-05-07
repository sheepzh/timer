import { type CSSProperties } from "vue"

export type BaseProps = Pick<
    CSSProperties,
    'width' | 'height' | 'minHeight' | 'boxSizing' | 'cursor' | 'maxWidth' | 'padding' | 'marginTop'
> & {
    id?: string
    inline?: boolean
    class?: string | string[]
    style?: CSSProperties
    onClick?: (ev: MouseEvent) => void
}

export const ALL_BASE_PROPS: (keyof BaseProps)[] = [
    'boxSizing', 'class', 'cursor', 'height', 'id', 'inline', 'marginTop', 'maxWidth', 'minHeight', 'onClick', 'padding', 'style', 'width'
]

const cvtPxScale = (val: number | string | undefined): string | undefined => typeof val === 'number' ? `${val}px` : val

export const cvt2BaseStyle = (props: BaseProps): CSSProperties => ({
    width: cvtPxScale(props.width),
    height: cvtPxScale(props.height),
    minHeight: cvtPxScale(props.minHeight),
    boxSizing: props.boxSizing,
    cursor: props.cursor,
    marginTop: cvtPxScale(props.marginTop),
    maxWidth: cvtPxScale(props.maxWidth),
    padding: cvtPxScale(props.padding),
    ...props.style ?? {},
})