import { version } from "../../../../package.json"

const totalInfoSpan: HTMLSpanElement = document.getElementById('total-info') as HTMLSpanElement

export function updateTotal(totalInfo: string): void {
    totalInfoSpan.innerText = `v${version} ${totalInfo}`
}