<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input class="filter-item"
                v-model="host"
                :placeholder="$t('dashboard.hostPlaceholder')"
                clearable
                @keyup.enter.native="queryData">
      </el-input>
      <span class="filter-item">
        <el-date-picker v-model="dateRange"
                        type="daterange"
                        format="yyyy/MM/dd"
                        range-separator="-"
                        :picker-options="pickerOptions"
                        :start-placeholder="$t('dashboard.startDate')"
                        :end-placeholder="$t('dashboard.endDate')">
        </el-date-picker>
      </span>
      <a class="filter-name">{{ $t('dashboard.mergeDate') }}</a>
      <el-switch class="filter-item"
                 v-model="mergeDate" />
      <a class="filter-name">{{ $t('dashboard.mergeDomain') }}</a>
      <el-switch class="filter-item"
                 v-model="mergeDomain" />
      <a class="filter-name">{{ $t('dashboard.displayBySecond') }}</a>
      <el-switch class="filter-item"
                 v-model="displayBySecond" />
    </div>
    <!-- table -->
    <el-table :data="tableData"
              border
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
                 height="12px"
                 @error="this.style.display='none'">
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
      <!-- Bug exists while collecting -->
      <!-- <el-table-column prop="time"
                       :label="$t('item.time')"
                       min-width="80px"
                       sortable="custom"
                       align="center" /> -->
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
import database, { QueryParam } from '../database'
import { FAVICON } from '../util/constant'
import { formatPeriodCommon } from '../util/time'
const ELEMENT_SORT_2_DB = {
  descending: QueryParam.DESC,
  ascending: QueryParam.ASC
}
export default {
  name: 'Dashboard',
  data () {
    return {
      host: '',
      mergeDate: false,
      mergeDomain: true,
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
          {
            text: this.$t('dashboard.latestWeek'),
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: this.$t('dashboard.latest30Days'),
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
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
    document.title = this.$t('dashboard.title')
    this.queryData()
  },
  methods: {
    queryData () {
      const param = {
        host: this.host,
        date: this.dateRange,
        mergeDomain: this.mergeDomain,
        mergeDate: this.mergeDate,
        sort: this.sort.prop,
        sortOrder: ELEMENT_SORT_2_DB[this.sort.order]
      }
      const page = {
        pageSize: this.page.size,
        pageNum: this.page.num
      }
      database.refresh(() => {
        const { list, total } = database.selectByPage(param, page)
        this.tableData = list
        this.page.total = total
      })
    },
    dateFormatter ({ date }) {
      if (!date) return '-'
      return date.substring(0, 4) + '/' + date.substring(4, 6) + '/' + date.substring(6, 8)
    },
    periodFormatter (val) {
      return val === undefined ? '-' : this.displayBySecond ? (Math.floor(val / 1000) + ' s') : formatPeriodCommon(val)
    },
    sortChangeHandler ({ prop, order }) {
      this.sort.prop = prop
      this.sort.order = order
      this.queryData()
    },
    getFaviconUrl (domain) {
      return FAVICON(domain)
    }
  }
}
</script>
<style scoped>
.app-container {
  width: 70%;
  height: 100%;
  margin: auto;
  padding-top: 35px;
}

.filter-container {
  padding-bottom: 10px;
}

.filter-item {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 10px;
  padding-right: 20px;
}
.filter-name {
  color: #909399;
  font-weight: bold;
  font-size: 14px;
}
.filter-item.el-input {
  width: 175px;
}
.pagination-container {
  width: 100%;
  text-align: center;
  margin-top: 23px;
}
</style>
<style>
.el-input__suffix {
  right: 30px !important;
}
.el-picker-panel__sidebar {
  width: 130px !important;
}
.el-picker-panel [slot="sidebar"] + .el-picker-panel__body,
.el-picker-panel__sidebar + .el-picker-panel__body {
  margin-left: 130px !important;
}
</style>