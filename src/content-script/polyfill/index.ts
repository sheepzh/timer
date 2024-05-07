import { RootElement, TAG_NAME } from "@cs/limit/element"

const main = () => {
    customElements.define(TAG_NAME, RootElement)
}

main()