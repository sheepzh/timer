<template>
  <div style="text-align:left; padding-left:30px; padding-top:20px;">
    <h3>{{ $t('clear.filterItems')}}</h3>
    <p>
      <a>1.&ensp;</a>
      <i18n path="clear.filterDate">
        <template v-slot:picker>
          <el-date-picker size="mini"
                          style="width:250px;"
                          start-placeholder="1994/12/15"
                          :end-placeholder="yesterdayMsg"
                          type="daterange"
                          :picker-options="pickerOptions"
                          range-separator="-"
                          v-model="dateRange" />
        </template>
      </i18n>
    </p>
    <p>
      <a>2.&ensp;</a>
      <i18n path="clear.filterFocus">

        <template v-slot:start>
          <el-input class="filter-input"
                    placeholder="0"
                    min="0"
                    clearable
                    v-model="focusStart"
                    size="mini" />
        </template>
        <template v-slot:end>
          <el-input class="filter-input"
                    size="mini"
                    :min="focusStart||0"
                    clearable
                    :placeholder="$t('clear.unlimited')"
                    v-model="focusEnd" />
        </template>
      </i18n>
    <p>
      <a>3.&ensp;</a>
      <i18n path="clear.filterTotal">
        <template v-slot:start>
          <el-input class="filter-input"
                    placeholder="0"
                    min="0"
                    clearable
                    v-model="totalStart"
                    size="mini" />
        </template>
        <template v-slot:end>
          <el-input class="filter-input"
                    size="mini"
                    :min="totalStart||0"
                    clearable
                    :placeholder="$t('clear.unlimited')"
                    v-model="totalEnd" />
        </template>
      </i18n>
    </p>
    <p>
      <a>4.&ensp;</a>
      <i18n path="clear.filterTime">
        <template v-slot:start>
          <el-input class="filter-input"
                    placeholder="0"
                    min="0"
                    clearable
                    v-model="timeStart"
                    size="mini" />
        </template>
        <template v-slot:end>
          <el-input class="filter-input"
                    size="mini"
                    :min="timeEnd||0"
                    clearable
                    :placeholder="$t('clear.unlimited')"
                    v-model="timeEnd" />
        </template>
      </i18n>
    </p>
    <div class="filter-container"
         style="padding-top:40px;">
      <el-tooltip :content="$t('clear.archiveAlert')">
        <el-button icon="el-icon-document-add"
                   type="primary"
                   size="mini"
                   @click="archiveBatch">{{ $t('item.operation.archive') }}</el-button>
      </el-tooltip>
      <el-button icon="el-icon-delete"
                 type="danger"
                 size="mini"
                 @click="deleteBatch">{{ $t('item.operation.delete') }}</el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.filter-input {
  width: 70px;
}
.el-input__suffix {
  right: 0px !important;
}
</style>
<script>
import timerDatabase, { QueryParam } from '../../../database/timer-database'
import timerService from '../../../service/timer-service'
import { formatTime, MILL_PER_DAY } from '../../../util/time'
export default {
  name: 'ClearFilter',
  data () {
    const yesterday = new Date().getTime() - MILL_PER_DAY

    const daysBefore = days => new Date().getTime() - days * MILL_PER_DAY
    const datePickerShortcut = (msg, days) => {
      return {
        text: this.$t(`clear.dateShortcut.${msg}`),
        onClick: picker => picker.$emit('pick', [undefined, daysBefore(days)])
      }
    }
    return {
      focusStart: 0,
      focusEnd: 2,
      totalStart: 0,
      totalEnd: undefined,
      timeStart: 0,
      timeEnd: undefined,
      dateRange: [undefined, yesterday],
      yesterdayMsg: formatTime(yesterday, '{y}/{m}/{d}'),
      pickerOptions: {
        disabledDate (date) { return date > yesterday },
        shortcuts: [
          datePickerShortcut('tillYesturday', 1),
          datePickerShortcut('till7DaysAgo', 7),
          datePickerShortcut('till30DaysAgo', 30)
        ]
      }
    }
  },
  methods: {
    /**
     * Assert query param with numberic range
     * 
     * @param range       numberic range, 2-length array
     * @param mustInteger must be integer?
     * @returns true when has error, or false
     */
    assertQueryParam (range, mustInteger) {
      const reg = mustInteger ? /^[0-9]+$/ : /^[0-9]+.?[0-9]*$/
      const start = range[0]
      const end = range[1]
      const noStart = start !== undefined && start !== '' && start !== null
      const noEnd = end !== undefined && end !== '' && end !== null
      return (noStart && !reg.test(start))
        || (noEnd && !reg.test(end))
        || (noStart && noEnd && Number.parseFloat(start) > Number.parseFloat(end))
    },
    generateParamAndSelect (success) {
      let hasError = false

      const totalRange = [(this.totalStart || 0) * 1000, this.totalEnd ? this.totalEnd * 1000 : undefined]
      hasError |= this.assertQueryParam(totalRange)
      const focusRange = [(this.focusStart || 0) * 1000, this.focusEnd ? this.focusEnd * 1000 : undefined]
      hasError |= this.assertQueryParam(focusRange)
      const timeRange = [this.timeStart || 0, this.timeEnd]
      hasError |= this.assertQueryParam(timeRange, true)
      const dateRange = this.dateRange

      if (hasError) {
        console.log(this)
        this.$message({
          message: this.$t('clear.paramError'),
          type: 'warning'
        })
      } else {
        const param = new QueryParam()
        param.totalRange = totalRange
        param.focusRange = focusRange
        param.timeRange = timeRange
        param.date = dateRange

        timerDatabase.select(success, param)
      }
    },
    archiveBatch () {
      this.generateParamAndSelect(result => {
        const count = result.length
        this.$confirm(this.$t('clear.archiveConfirm', { count }))
          .then(
            () => timerService.archive(result, () => {
              this.$message(this.$t('clear.archiveSuccess'))
              this.$emit('dataChanged')
            })
          )
          .catch(() => { })
      })
    },
    deleteBatch () {
      this.generateParamAndSelect(result => {
        const count = result.length
        this.$confirm(this.$t('clear.deleteConfirm', { count }))
          .then(
            () => timerDatabase.delete(result, () => {
              this.$message(this.$t('clear.deleteSuccess'))
              this.$emit('dataChanged')
            })
          )
          .catch(() => { })
      })
    }
  }
}
</script>