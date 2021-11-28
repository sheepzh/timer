import { Download } from "@element-plus/icons"
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon } from "element-plus"
import { Ref, h } from "vue"
import SiteInfo from "../../../../entity/dto/site-info"
import { exportCsv, exportJson } from "../../../../util/file"
import { t } from "../../../locale"
import { dateFormatter, periodFormatter } from "../formatter"

type FileFormat = 'json' | 'csv'

type ExportInfo = {
    host: string
    date?: string
    total?: string
    focus?: string
    time?: number
}

type _Props = {
    mergeDateRef: Ref<boolean>
    dataRef: Ref<SiteInfo[]>
    exportFileName: Ref<string>
}

export type DownloadFileProps = _Props

/** 
 * @param rows row data
 * @returns data with json format 
 */
const generateJsonData = (rows: SiteInfo[]) => {
    return rows.map(row => {
        const data: ExportInfo = { host: row.host }
        // Always display by seconds
        data.total = periodFormatter(row.total, true, true)
        data.focus = periodFormatter(row.focus, true, true)
        data.time = row.time
        return data
    })
}

/** 
 * @param rows row data
 * @returns data with csv format 
 */
const generateCsvData = (rows: SiteInfo[], mergeDate: boolean) => {
    let columnName: Array<keyof SiteInfo> = []
    !mergeDate && columnName.push('date')
    columnName = [...columnName, 'host', 'total', 'focus', 'time']
    const data = [columnName.map(c => t(msg => msg.item[c]))]
    rows.forEach(row => {
        const csvR = []
        !mergeDate && csvR.push(dateFormatter(row.date))
        data.push([...csvR, row.host, periodFormatter(row.total, true), periodFormatter(row.focus, true), row.time])
    })
    return data
}

const exportFile = (props: _Props, format: FileFormat) => {
    const rows = props.dataRef.value
    const fileName = props.exportFileName.value
    format === 'json' && exportJson(generateJsonData(rows), fileName)
    format === 'csv' && exportCsv(generateCsvData(rows, props.mergeDateRef.value), fileName)
}

const dropButton = () => h<{}>(ElButton,
    { size: 'mini', class: 'export-dropdown-button' },
    () => h(ElIcon, { size: 17, style: { padding: '0 1px' } }, h(Download))
)

const dropdownMenuItem = (format: FileFormat, props: _Props) => h(ElDropdownItem, { onClick: () => exportFile(props, format) }, () => format)

const dropdownMenu = (props: _Props) => h(ElDropdownMenu, {},
    () => (['csv', 'json'] as FileFormat[]).map(format => dropdownMenuItem(format, props))
)

const downloadFile = (props: _Props) => h(ElDropdown,
    { class: 'export-dropdown', showTimeout: 100 },
    {
        default: dropButton,
        dropdown: () => dropdownMenu(props)
    }
)

export default downloadFile