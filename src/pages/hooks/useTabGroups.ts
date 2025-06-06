import { listAllGroups } from "@api/chrome/tabGroups"
import { computed, onUnmounted } from "vue"
import { useRequest } from "."

export const useTabGroups = () => {
    const { data: groups, refresh } = useRequest(listAllGroups, { defaultValue: [] })
    const groupMap = computed(() => {
        var map: Record<number, chrome.tabGroups.TabGroup> = {}
        groups.value.forEach(g => map[g.id] = g)
        return map
    })

    chrome.tabGroups.onCreated.addListener(refresh)
    chrome.tabGroups.onRemoved.addListener(refresh)
    chrome.tabGroups.onUpdated.addListener(refresh)

    onUnmounted(() => {
        chrome.tabGroups.onCreated.removeListener(refresh)
        chrome.tabGroups.onRemoved.removeListener(refresh)
        chrome.tabGroups.onUpdated.removeListener(refresh)
    })

    return { groups, groupMap }
}