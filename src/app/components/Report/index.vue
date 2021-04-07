<template>
  <div class="content-container">
    <div class="filter-container">
      <el-input class="filter-item"
                v-model="host"
                :placeholder="$t('report.hostPlaceholder')"
                clearable
                @keyup.enter.native="queryData">
      </el-input>
      <span class="filter-item">
        <el-date-picker v-model="dateRange"
                        type="daterange"
                        format="yyyy/MM/dd"
                        range-separator="-"
                        :picker-options="pickerOptions"
                        :start-placeholder="$t('report.startDate')"
                        :end-placeholder="$t('report.endDate')">
        </el-date-picker>
      </span>
      <a class="filter-name">{{ $t('report.mergeDate') }}</a>
      <el-switch class="filter-item"
                 v-model="mergeDate" />
      <a class="filter-name">{{ $t('report.mergeDomain') }}</a>
      <el-switch class="filter-item"
                 v-model="mergeDomain" />
      <a class="filter-name">{{ $t('report.displayBySecond') }}</a>
      <el-switch class="filter-item"
                 v-model="displayBySecond" />
      <el-dropdown class="export-dropdown"
                   :show-timeout="100">
        <el-button size="mini"
                   class="export-dropdown-button">
          <i class="el-icon-download export-dropdown-menu-icon" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="format in ['csv','json']"
                            :key="format"
                            @click.native="exportFile(format)">
            {{ format }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- table -->
    <el-table :data="tableData"
              border
              size="mini"
              :default-sort="sort"
              @sort-change="sortChangeHandler"
              style="width: 100%">
      <el-table-column prop="date"
                       :label="$t('item.date')"
                       min-width="100px"
                       align="center"
                       :formatter="dateFormatter"
                       sortable="custom"
                       v-if="!mergeDate" />
      <el-table-column prop="host"
                       :label="$t('item.host')"
                       min-width="170px"
                       sortable="custom"
                       align="center">
        <template slot-scope="{row}">
          <span>{{ row.host }}</span>
          <span style="height:23px;line-height:23px;padding-left:2px;">
            <img v-if="!mergeDomain"
                 :src="getFaviconUrl(row.host)"
                 width="12px"
                 height="12px">
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="focus"
                       :label="$t('item.focus')"
                       min-width="130px"
                       sortable="custom"
                       align="center"
                       :formatter="row => periodFormatter(row.focus)" />
      <el-table-column prop="total"
                       :label="$t('item.total')"
                       min-width="130px"
                       sortable="custom"
                       align="center"
                       :formatter="row => periodFormatter(row.total)" />
      <el-table-column prop="time"
                       :label="$t('item.time')"
                       min-width="70px"
                       sortable="custom"
                       align="center"
                       :formatter="row => row.time || 0" />
      <el-table-column :label="$t('item.operation.label')"
                       :width="$t('item.operation.minWidth')"
                       align="center"
                       v-if="!mergeDomain">
        <template slot-scope="{row}">
          <el-popconfirm :confirm-button-text='$t("item.operation.confirmMsg")'
                         :cancel-button-text="$t('item.operation.cancelMsg')"
                         :title="deleteMsg"
                         @confirm="deleteUrl(row)">
            <el-button size="mini"
                       slot="reference"
                       type="warning"
                       @click="changeDeleteConfirmUrl(row)"
                       icon="el-icon-delete">
              {{ $t('item.operation.delete') }}
            </el-button>
          </el-popconfirm>
          <el-popconfirm :confirm-button-text='$t("item.operation.confirmMsg")'
                         :cancel-button-text="$t('item.operation.cancelMsg')"
                         :title="$t('setting.whitelist.addConfirmMsg',{ url: row.host })"
                         icon="el-icon-info"
                         icon-color="red"
                         @confirm="add2Whitelist(row.host)">
            <el-button size="mini"
                       slot="reference"
                       type="danger"
                       icon="el-icon-plus">
              {{ $t('item.operation.add2Whitelist') }}
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination @size-change="queryData"
                     @current-change="queryData"
                     :current-page.sync="page.num"
                     :page-sizes="[10, 20, 50]"
                     :page-size.sync="page.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="page.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import timerDatabase, { DATE_FORMAT, QueryParam } from '../../../database/timer-database'
import whitelistService from '../../../service/whitelist-service'
import { FAVICON } from '../../../util/constant/url'
import { formatPeriodCommon, formatTime } from '../../../util/time'
import { exportCsv, exportJson } from '../../../util/file'
import { MILL_PER_DAY } from '../../../util/time'
const ELEMENT_SORT_2_DB = {
  descending: QueryParam.DESC,
  ascending: QueryParam.ASC
}
const DISPLAY_DATE_FORMAT = '{y}/{m}/{d}'
export default {
  name: 'Dashboard',
  data () {
    const daysAgo = (start, end) => {
      const current = new Date().getTime()
      return [current - start * MILL_PER_DAY, current - end * MILL_PER_DAY]
    }
    const datePickerShortcut = (msg, agoOfStart, agoOfEnd) => {
      return {
        text: this.$t(`report.${msg}`),
        onClick: picker => picker.$emit('pick', daysAgo(agoOfStart || 0, agoOfEnd || 0))
      }
    }

    return {
      host: '',
      mergeDate: true,
      mergeDomain: false,
      displayBySecond: false,
      dateRange: [],
      sort: {
        prop: 'focus',
        order: 'descending'
      },
      page: {
        size: 10,
        num: 1,
        total: 0
      },
      tableData: [],
      pickerOptions: {
        disabledDate: date => date > new Date(),
        shortcuts: [
          datePickerShortcut('today'),
          datePickerShortcut('yesterday', 1, 1),
          datePickerShortcut('latestWeek', 7),
          datePickerShortcut('latest30Days', 30)
        ]
      },
      /**
       * Confirm message to delete
       * Changes according to both this.mergeDate and the date of item to delete. So can't be computed
       */
      deleteMsg: ''
    }
  },
  watch: {
    mergeDate () {
      this.queryData()
    },
    mergeDomain () {
      this.queryData()
    },
    dateRange () {
      this.queryData()
    }
  },
  created () {
    this.queryData()
  },
  methods: {
    queryData () {
      const page = {
        pageSize: this.page.size,
        pageNum: this.page.num
      }
      timerDatabase.selectByPage(({ list, total }) => {
        this.tableData = list
        this.page.total = total
      }, this.queryParam, page)
    },
    dateFormatter ({ date }) {
      if (!date) return '-'
      return date.substring(0, 4) + '/' + date.substring(4, 6) + '/' + date.substring(6, 8)
    },
    periodFormatter (val, hideUnitOfSecond, force2DisplayBySecond) {
      if (val === undefined) {
        return force2DisplayBySecond ? '0' : '-'
      } else {
        const bySecond = this.displayBySecond || force2DisplayBySecond
        const second = Math.floor(val / 1000)
        return bySecond ? (second + (hideUnitOfSecond ? '' : ' s')) : formatPeriodCommon(val)
      }
    },
    sortChangeHandler ({ prop, order }) {
      this.sort.prop = prop
      this.sort.order = order
      this.queryData()
    },
    getFaviconUrl (domain) {
      return FAVICON(domain)
    },
    changeDeleteConfirmUrl (row) {
      const { host } = row
      if (this.mergeDate) {
        if (!this.dateRange || !this.dateRange.length) {
          // Delete all
          this.deleteMsg = this.$t('item.operation.deleteConfirmMsgAll', { url: host })
        } else {
          const start = this.dateRange[0]
          const end = this.dateRange[1]
          if (start === end) {
            // Among one day
            this.deleteMsg = this.$t('item.operation.deleteConfirmMsg', { url: host, date: formatTime(start, DISPLAY_DATE_FORMAT) })
          } else {
            // Period
            this.deleteMsg = this.$t('item.operation.deleteConfirmMsgRange',
              { url: host, start: formatTime(start, DISPLAY_DATE_FORMAT), end: formatTime(end, DISPLAY_DATE_FORMAT) }
            )
          }
        }
      } else {
        // Not merge, delete one item
        this.deleteMsg = this.$t('item.operation.deleteConfirmMsg', { url: host, date: this.dateFormatter(row) })
      }
    },
    /**
     * Delete the url
     */
    deleteUrl ({ host, date }) {
      if (this.mergeDate) {
        if (!this.dateRange || !this.dateRange.length) {
          // Delete all
          timerDatabase.deleteByUrl(host, this.queryData)
        } else {
          // Delete by range
          timerDatabase.deleteByUrlBetween(
            host, this.queryData,
            formatTime(this.dateRange[0], DATE_FORMAT),
            formatTime(this.dateRange[1], DATE_FORMAT)
          )
        }
      } else {
        // Delete by date
        timerDatabase.deleteByUrlAndDate(host, date, this.queryData)
      }
    },
    /**
     * Add the url to whitelist
     */
    add2Whitelist (host) {
      whitelistService.add(host, () => this.queryData())
    },
    /**
     * Handle the command of dropdown
     */
    exportFile (format) {
      timerDatabase.select(rows => {
        if (format === 'json') {
          rows.forEach(row => {
            // Always display by seconds
            row.total = this.periodFormatter(row.total, true, true)
            row.focus = this.periodFormatter(row.focus, true, true)
          })
          exportJson(rows, this.exportFileName)
        } else if (format === 'csv') {
          let columnName = []
          !this.mergeDate && columnName.push('date')
          columnName = [...columnName, 'host', 'total', 'focus', 'time']
          const data = [columnName.map(c => this.$t(`item.${c}`))]
          rows.forEach(row => {
            const csvR = []
            !this.mergeDate && csvR.push(this.dateFormatter(row))
            data.push([...csvR, row.host, this.periodFormatter(row.total, true), this.periodFormatter(row.focus, true), row.time])
          })
          exportCsv(data, this.exportFileName)
        }
      }, this.queryParam)
    }
  },
  computed: {
    queryParam () {
      return {
        host: this.host,
        date: this.dateRange,
        mergeDomain: this.mergeDomain,
        mergeDate: this.mergeDate,
        sort: this.sort.prop,
        sortOrder: ELEMENT_SORT_2_DB[this.sort.order]
      }
    },
    exportFileName () {
      let baseName = this.$t('report.exportFileName')
      if (this.dateRange && this.dateRange.length === 2) {
        const start = this.dateRange[0]
        const end = this.dateRange[1]
        if (start === end) {
          baseName += '_' + formatTime(start, '{y}{m}{d}')
        } else {
          baseName += '_' + formatTime(start, '{y}{m}{d}') + '_' + formatTime(end, '{y}{m}{d}')
        }
      }
      this.mergeDate && (baseName += '_' + this.$t('report.mergeDate'))
      this.mergeDomain && (baseName += '_' + this.$t('report.mergeDomain'))
      this.displayBySecond && (baseName += '_' + this.$t('report.displayBySecond'))
      return baseName
    }
  }
}
</script>
<style>
.el-button [class*="el-icon-"] + span {
  margin-left: 0px !important;
}
.export-dropdown {
  float: right;
}
.export-dropdown-menu-icon {
  font-size: 16px;
}
.export-dropdown-button {
  padding: 7px !important;
  margin-top: 8px;
}
</style>