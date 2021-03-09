<template>
  <div class="app">
    <v-chart :option="option"
             width="750"
             height="500" />
    <div class="option-container">
      <span class="option-left"
            style="color: #606266;font-size:12px;">
        {{ `v${version}` }}
        &ensp;
        {{ $t('popup.totalTime', { totalTime }) }}
      </span>
      <el-select size="mini"
                 v-model="type"
                 class="option-right"
                 style="width:140px;">
        <el-option v-for="n in allTypes"
                   :key="n"
                   :value="n"
                   :label="$t(`item.${n}`)" />
      </el-select>
      <el-tooltip :content="$t('popup.mergeDomainLabel')">
        <el-switch v-model="mergeDomain"
                   style="margin-left:10px;"
                   class="option-right" />
      </el-tooltip>
      <el-link icon="el-icon-view"
               class="option-right"
               @click="openDashboard()">{{ $t('popup.allData') }}</el-link>
    </div>
  </div>
</template>
<script>
const { version } = require('../../package.json')
import { IS_FIREFOX } from '../util/constant'
import database from '../database'
import VChart from "vue-echarts"
import { use } from 'echarts/core'
import { CanvasRenderer } from "echarts/renderers"
import { PieChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent, ToolboxComponent } from "echarts/components"
import { formatPeriodCommon, formatTime } from '../util/time'
import { FAVICON } from '../util/constant'

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, ToolboxComponent, LegendComponent])

const DEFAULT_DATE_TYPE = 'focus'

/**
 * If the percentage of target site is less than SHOW_ICON_THRESHOLD, don't show its icon
 */
const LABEL_FONT_SIZE = 13
const LABEL_ICON_SIZE = 13

const host2LabelStyle = host => host.replaceAll('.', '00').replaceAll('-', '01')

const OTHER_LABEL = 'OTHERS'

export default {
  name: 'Main',
  components: {
    VChart
  },
  data () {
    const app = this.$t('app.name')
    const today = formatTime(new Date(), '{y}_{m}_{d}')
    const todayForShow = formatTime(new Date(), '{y}/{m}/{d}')
    return {
      version,
      tableData: [],
      type: DEFAULT_DATE_TYPE, // focus or total
      mergeDomain: true,
      allTypes: ['focus', 'total'],
      option: {
        title: {
          text: this.$t('popup.title'),
          subtext: `${todayForShow} @ ${app}`,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter ({ name, percent, value }) {
            return `${name}<br/>${formatPeriodCommon(value)} (${percent}%)`
          }
        },
        legend: {
          type: 'scroll',
          left: 'left',
          orient: 'vertical',
          left: 15,
          top: 20,
          bottom: 20,
          data: []
        },
        series: [
          {
            label: {
              formatter: ({ name }) => this.mergeDomain || name === OTHER_LABEL ? name : `{${host2LabelStyle(name)}|} {a|${name}}`
            },
            name: "Wasted Time",
            type: "pie",
            radius: "55%",
            center: ["64%", "52%"],
            startAngle: 300,
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            }
          }
        ],
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              show: true,
              title: this.$t('popup.saveAsImageTitle'),
              name: this.$t('popup.fileName', { app, today }), // file name
              excludeComponents: ['toolbox'],
              pixelRatio: 2
            }
          }
        }
      }
    }
  },
  created () {
    database.refresh(() => this.queryData())
  },
  computed: {
    totalTime () {
      return formatPeriodCommon(this.tableData.map(d => d[this.type]).reduce((a, b) => a + b, 0))
    }
  },
  watch: {
    type () {
      this.queryData()
    },
    mergeDomain () {
      this.queryData()
    }
  },
  methods: {
    queryData () {
      const rows = database.select({ date: new Date(), mergeDomain: this.mergeDomain, sort: this.type })
      this.tableData = []
      const other = { host: OTHER_LABEL, focus: 0, total: 0 }
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        if (i < 10) {
          this.tableData.push(row)
        } else {
          other.focus += row.focus
          other.total += row.total
        }
      }
      if (rows.length > 10) {
        this.tableData.push(other)
      }
      this.calculateData()
    },
    dateFormatter ({ date }) {
      return `${date.substring(0, 4)} - ${date.substring(4, 6)} - ${date.substring(6, 8)}`
    },
    calculateData () {
      const legendData = []
      const series = []
      const iconRich = {}
      this.tableData.forEach(d => {
        const { host } = d
        legendData.push(host)
        series.push({ name: host, value: d[this.type] || 0 })
        iconRich[host2LabelStyle(host)] = {
          height: LABEL_ICON_SIZE,
          width: LABEL_ICON_SIZE,
          fontSize: LABEL_ICON_SIZE,
          backgroundColor: { image: FAVICON(host) }
        }
      })
      this.option.legend.data = legendData
      this.option.series[0].data = series
      this.option.series[0].label.rich = {
        a: { fontSize: LABEL_FONT_SIZE },
        ...iconRich
      }
    },
    openDashboard () {
      // FireFox use 'static' as prefix
      const url = IS_FIREFOX ? 'dashboard.html' : 'static/dashboard.html'
      chrome.tabs.create({ url })
    }
  }
}
</script>
<style scoped>
.app {
  width: 750px;
  height: 500px;
}
.option-container {
  padding-bottom: 10px;
  width: 95%;
  margin: auto;
  height: 30px;
}
.option-right {
  margin-left: 10px;
  float: right;
  height: 30px;
  line-height: 30px;
}
.option-left {
  margin-right: 10px;
  height: 30px;
  line-height: 30px;
  padding-top: 8px;
  float: left;
}
</style>