
export const cvtPxScale = (val: number | string | undefined): string | undefined => typeof val === 'number' ? `${val}px` : val