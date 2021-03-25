<template>
  <div class="content-container">
    <div class="filter-container">
      <el-select :placeholder="$t('trender.hostPlaceholder')"
                 class="filter-item"
                 v-model="trenderDomain"
                 clearable
                 filterable
                 remote
                 :remote-method="queryDomainHandler"
                 :loading="trenderSearching">
        <el-option v-for="option in trenderDomainOptions"
                   :key="option"
                   :label="option"
                   :value="option" />
      </el-select>
      <span class="filter-item">
        <el-date-picker v-model="dateRange"
                        type="daterange"
                        format="yyyy/MM/dd"
                        range-separator="-"
                        :picker-options="pickerOptions"
                        :start-placeholder="$t('trender.startDate')"
                        :end-placeholder="$t('trender.endDate')"
                        unlink-panels>
        </el-date-picker>
      </span>
      <domain-trender :date-range="dateRange"
                      :domain="trenderDomain"
                      :field="trenderField" />
    </div>
  </div>
</template>
<script>
import timerService from '../../../service/timer-service'
import DomainTrender from './components/DomainTrender'
import { MILL_PER_DAY } from '../../../util/time'
export default {
  name: 'Trender',
  components: { DomainTrender },
  data () {
    const daysAgo = (start, end) => {
      const current = new Date().getTime()
      return [current - start * MILL_PER_DAY, current - end * MILL_PER_DAY]
    }
    const datePickerShortcut = (msg, agoOfStart, agoOfEnd) => {
      return {
        text: this.$t(`trender.${msg}`),
        onClick: picker => picker.$emit('pick', daysAgo(agoOfStart || 0, (agoOfEnd || 0) + 1))
      }
    }
    return {
      trenderDomain: '',
      trenderSearching: false,
      trenderDomainOptions: [],
      trenderField: 'focus',
      dateRange: daysAgo(15, 1),
      pickerOptions: {
        disabledDate: date => date.getTime() > new Date().getTime() - MILL_PER_DAY,
        shortcuts: [
          datePickerShortcut('latestWeek', 7),
          datePickerShortcut('latest15Days', 15),
          datePickerShortcut('latest30Days', 30),
          datePickerShortcut('latest90Days', 90)
        ]
      }
    }
  },
  methods: {
    queryDomainHandler (query) {
      if (!query) {
        this.trenderDomainOptions = []
      } else {
        this.trenderSearching = true
        timerService.listDomains(query, domains => {
          this.trenderDomainOptions = domains
          this.trenderSearching = false
        })
      }
    }
  }
}
</script>