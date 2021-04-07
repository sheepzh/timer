<template>
  <el-card style="margin-top:25px;">
    <div style="width:100%;height:600px;"
         ref="chart" />
  </el-card>
</template>
<script>
import { init } from 'echarts'
import timerDatabase, { QueryParam } from '../../../../database/timer-database'
import SiteInfo from '../../../../entity/dto/site-info'
import { formatPeriodCommon, formatTime, MILL_PER_DAY } from '../../../../util/time'

// Get the timestamp of one timestamp of date
const timestampOf = d => d.getTime ? d.getTime() : d

const mill2Second = mill => Math.floor((mill || 0) / 1000)


export default {
  name: 'DomainTrender',
  props: {
    domain: {
      type: String
    },
    dateRange: {
      type: Array
    },
    field: {
      type: 'focus' | 'total' | 'time'
    }
  },
  data () {
    const formatTimeOfEchart = ({ seriesName, name, value }) => `${seriesName}<br/>${name}&ensp;-&ensp;${formatPeriodCommon(value * 1000)}`

    return {
      rows: [],
      chart: undefined,
      option: {
        backgroundColor: 'rgba(0,0,0,0)',
        grid: { top: '100' },
        title: {
          text: this.$t('trender.history.title'),
          subtext: '',
          left: 'center',
          align: ''
        },
        tooltip: {
          trigger: 'item'
        },
        toolbox: {
          feature: {
            saveAsImage: {
              show: true,
              title: this.$t('popup.saveAsImageTitle'),
              excludeComponents: ['toolbox'],
              pixelRatio: 2,
              backgroundColor: '#fff'
            }
          }
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: [
          { name: this.$t('trender.history.timeUnit'), type: 'value' },
          { name: this.$t('trender.history.numberUnit'), type: 'value' }
        ],
        legend: {
          left: 'left',
          data: [this.$t('item.total'), this.$t('item.focus'), this.$t('item.time')]
        },
        series: [
          // run time
          {
            name: this.$t('item.total'),
            data: [],
            yAxisIndex: 0,
            type: 'line',
            smooth: true,
            tooltip: { formatter: formatTimeOfEchart }
          },
          {
            name: this.$t('item.focus'),
            data: [],
            yAxisIndex: 0,
            type: 'line',
            smooth: true,
            tooltip: { formatter: formatTimeOfEchart }
          },
          {
            name: this.$t('item.time'),
            data: [],
            yAxisIndex: 1,
            type: 'line',
            smooth: true,
            tooltip: {
              formatter: ({ seriesName, name, value }) => `${seriesName}<br/>${name}&emsp;-&emsp;${value}`
            }
          }
        ]
      }
    }
  },
  mounted () {
    this.chart = init(this.$refs.chart)
    this.updateXAxis()
    this.renderChart()
  },
  methods: {
    queryData () {
      if (this.domain === '') {
        // Do nothing
        return
      }
      timerDatabase.select(rows => {
        const dateInfoMap = {}
        rows.forEach(row => dateInfoMap[row.date] = row)
        const allXAxis = this.getAxias('{y}{m}{d}')

        const focusData = []
        const totalData = []
        const timeData = []

        allXAxis.forEach(date => {
          const row = dateInfoMap[date] || new SiteInfo()
          focusData.push(mill2Second(row.focus))
          totalData.push(mill2Second(row.total))
          timeData.push(row.time || 0)
        })

        this.option.title.subtext = this.domain
        this.option.series[0].data = totalData
        this.option.series[1].data = focusData
        this.option.series[2].data = timeData
        this.renderChart()
      }, this.queryParam)
    },
    renderChart () {
      this.chart && this.chart.setOption(this.option)
    },
    /**
     * Get the x-axis of date 
     */
    getAxias (format) {
      if (!this.dateRange) {
        // @since 0.0.9
        // The dateRange is cleared, return empty data
        return []
      }
      const xAxisData = []
      const startTime = timestampOf(this.dateRange[0])
      const endTime = timestampOf(this.dateRange[1])
      for (let time = startTime; time <= endTime; time += MILL_PER_DAY) {
        xAxisData.push(formatTime(time, format))
      }
      return xAxisData
    },
    /**
     * Update the x-axis
     */
    updateXAxis () {
      if (!this.dateRange || this.dateRange.length !== 2) {
        this.option.xAxis.data = []
      }
      this.option.xAxis.data = this.getAxias('{m}/{d}')
    }
  },
  computed: {
    queryParam () {
      return {
        host: this.domain,
        fullHost: true,
        sort: 'date',
        sortOrder: QueryParam.ASC
      }
    }
  },
  watch: {
    domain () {
      this.queryData()
    },
    dateRange () {
      this.updateXAxis()
      this.queryData()
    }
  }
}
</script>