export const LINK_STYLE: Partial<CSSStyleDeclaration> = {
    color: 'inherit',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif',
    fontSize: '16px !important'
}

export const MASK_STYLE: Partial<CSSStyleDeclaration> = {
    width: "100%",
    height: "100%",
    position: "fixed",
    zIndex: '99999',
    display: 'block',
    top: '0px',
    left: '0px',
    textAlign: 'center',
    paddingTop: '120px'
}

export type FilterStyle = {
    mask: Partial<CSSStyleDeclaration>
    delayConfirm: Partial<CSSStyleDeclaration>
}

export const FILTER_STYLES: Record<timer.limit.FilterType, FilterStyle> = {
    translucent: {
        mask: {
            backgroundColor: '#444',
            opacity: '0.9',
            color: '#EEE',
        },
        delayConfirm: {
            background: "#111",
        },
    },
    groundGlass: {
        mask: {
            color: '#111',
            backdropFilter: 'blur(5px)',
        },
        delayConfirm: {
            background: "#dedede",
        },
    }
}