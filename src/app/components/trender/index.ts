import { ElDatePicker, ElOption, ElSelect } from "element-plus"
import { defineComponent, h, onMounted, Ref, ref, watch } from "vue"
import { t } from "../../locale"
import timerService from "../../../service/timer-service"
import { MILL_PER_DAY } from "../../../util/time"
import DomainTrender from './components/domain-trender'
const daysAgo = (start: number, end: number) => {
    const current = new Date().getTime()
    return [new Date(current - start * MILL_PER_DAY), new Date(current - end * MILL_PER_DAY)]
}
const datePickerShortcut = (msg: string, agoOfStart?: number, agoOfEnd?: number) => {
    return {
        text: t(messages => messages.trender[msg]),
        value: daysAgo(agoOfStart || 0, (agoOfEnd || 0) + 1)
    }
}
const trenderDomainRef: Ref<string> = ref('')
const trenderSearchingRef: Ref<boolean> = ref(false)
const trenderDomainOptionsRef: Ref<Array<string>> = ref([])
const dateRangeRef: Ref<Array<Date>> = ref(daysAgo(15, 1))
const chartRef: Ref = ref()

export default defineComponent(() => {
    // Domain select
    const domainSelectOptions = () => trenderDomainOptionsRef.value.map(domain => h(ElOption, { label: domain, value: domain }))
    const domainSelect = () => h(ElSelect,
        {
            placeholder: t(msg => msg.trender.hostPlaceholder),
            class: 'filter-item',
            modelValue: trenderDomainRef.value,
            clearable: true,
            filterable: true,
            remote: true,
            loading: trenderSearchingRef.value,
            remoteMethod: (query: string) => {
                if (!query) {
                    trenderDomainOptionsRef.value = []
                } else {
                    trenderSearchingRef.value = true
                    timerService
                        .listDomains(query)
                        .then(domains => {
                            trenderDomainOptionsRef.value = Array.from(domains)
                            trenderSearchingRef.value = false
                        })
                }
            },
            onChange: (val: string) => trenderDomainRef.value = val,
            onClear: () => trenderDomainRef.value = ''
        }, domainSelectOptions)
    // Date picker
    const picker = () => h(ElDatePicker, {
        modelValue: dateRangeRef.value,
        type: 'daterange',
        format: 'YYYY/MM/DD',
        rangeSeparator: '-',
        startPlaceholder: t(msg => msg.trender.startDate),
        endPlaceholder: t(msg => msg.trender.endDate),
        unlinkPanels: true,
        disabledDate: (date: Date) => date.getTime() > new Date().getTime() - MILL_PER_DAY,
        shortcuts: [
            datePickerShortcut('latestWeek', 7),
            datePickerShortcut('latest15Days', 15),
            datePickerShortcut('latest30Days', 30),
            datePickerShortcut('latest90Days', 90)
        ],
        'onUpdate:modelValue': (newVal: Date[]) => dateRangeRef.value = newVal
    })
    const datePickerItem = () => h('span', { class: 'filter-item' }, picker())
    const filterContainer = () => h('div', { class: 'filter-container' }, [domainSelect(), datePickerItem()])

    watch(trenderDomainRef, () => chartRef.value.setDomain(trenderDomainRef.value))
    watch(dateRangeRef, () => chartRef.value.setDateRange(dateRangeRef.value))
    onMounted(() => chartRef.value.setDateRange(dateRangeRef.value))

    // chart 
    const chart = () => h(DomainTrender, { ref: chartRef })
    return () => h('div', { class: 'content-container' }, [filterContainer(), chart()])
})

