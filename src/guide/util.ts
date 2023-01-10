export function position2AnchorClz(position: Position): string {
    return `anchor-${position?.replace('.', '-')}`
}