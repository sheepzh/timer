import { computed, defineComponent, h, reactive, Ref, ref, UnwrapRef } from 'vue'
import { t } from '../../locale'
import SiteInfo from "../../../entity/dto/site-info"
import timerService, { SortDirect } from "../../../service/timer-service"
import whitelistService from "../../../service/whitelist-service"
import { formatTime } from "../../../util/time"
import './styles/element'
import table, { ElSortDirect, SortInfo, TableProps } from "./table"
import filter, { FilterProps } from "./filter"
import pagination, { PaginationProps } from "./pagination"
import { renderContentContainer } from '../common/content-container'
import { QueryData, PaginationInfo } from '../common/constants'
import { useRouter } from 'vue-router'

const hostRef: Ref<string> = ref('')
const now = new Date()
const dateRangeRef: Ref<Array<Date>> = ref([now, now])
const mergeDateRef: Ref<boolean> = ref(false)
const mergeDomainRef: Ref<boolean> = ref(false)
const displayBySecondRef: Ref<boolean> = ref(false)
const dataRef: Ref<SiteInfo[]> = ref([])
const whitelistRef: Ref<Array<string>> = ref([])
const sortRef: UnwrapRef<SortInfo> = reactive({
    prop: 'focus',
    order: ElSortDirect.DESC
})
const pageRef: UnwrapRef<PaginationInfo> = reactive({
    size: 10,
    num: 1,
    total: 0
})

const queryParam = computed(() => {
    return {
        host: hostRef.value,
        date: dateRangeRef.value,
        mergeDomain: mergeDomainRef.value,
        mergeDate: mergeDateRef.value,
        sort: sortRef.prop,
        sortOrder: sortRef.order === ElSortDirect.ASC ? SortDirect.ASC : SortDirect.DESC
    }
})

const exportFileName = computed(() => {
    let baseName = t(msg => msg.report.exportFileName)
    const dateRange = dateRangeRef.value
    if (dateRange && dateRange.length === 2) {
        const start = dateRange[0]
        const end = dateRange[1]
        baseName += '_' + formatTime(start, '{y}{m}{d}')
        baseName += '_' + formatTime(end, '{y}{m}{d}')
    }
    mergeDateRef.value && (baseName += '_' + t(msg => msg.report.mergeDate))
    mergeDomainRef.value && (baseName += '_' + t(msg => msg.report.mergeDomain))
    displayBySecondRef.value && (baseName += '_' + t(msg => msg.report.displayBySecond))
    return baseName
})

const queryData: QueryData = async () => {
    const page = { pageSize: pageRef.size, pageNum: pageRef.num }
    const pageResult = await timerService.selectByPage(queryParam.value, page)
    const { list, total } = pageResult
    dataRef.value = list
    pageRef.total = total
}

const queryWhiteList = async () => {
    const whitelist = await whitelistService.listAll()
    whitelistRef.value = whitelist
    return await Promise.resolve()
}

queryWhiteList().then(queryData)

const tableProps: TableProps = {
    mergeDateRef,
    mergeDomainRef,
    displayBySecondRef,
    queryWhiteList,
    queryData,
    whitelistRef,
    dateRangeRef,
    dataRef,
    sortRef,
    router: undefined
}

const filterProps: FilterProps = {
    mergeDateRef,
    mergeDomainRef,
    displayBySecondRef,
    queryData,
    dataRef,
    exportFileName,
    hostRef,
    dateRangeRef
}

const paginationProps: PaginationProps = {
    queryData,
    pageRef
}

const childNodes = () => [filter(filterProps), table(tableProps), pagination(paginationProps)]

export default defineComponent(() => {
    const router = useRouter()
    tableProps.router = router
    console.log(router)
    return renderContentContainer(() => childNodes())
})
