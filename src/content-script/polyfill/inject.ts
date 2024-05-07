import { getUrl } from "@api/chrome/runtime"

export const POLYFILL_SCRIPT_NAME = 'content_scripts_polyfill'

export const injectPolyfill = () => {
    const script = document.createElement('script')
    script.type = 'module'
    const scriptUrl = getUrl(`${POLYFILL_SCRIPT_NAME}.js`)
    script.src = scriptUrl
    try {
        document.body.appendChild(script)
    } catch {
        // Ignored
    }
}