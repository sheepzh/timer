import { RootElement, TAG_NAME } from "@cs/limit/element"

const main = () => {
    const exist = !!customElements.get(TAG_NAME)
    !exist && customElements.define(TAG_NAME, RootElement)
}

main()