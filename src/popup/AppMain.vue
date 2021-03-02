<template>
  <div class="app">
    <v-chart :option="option" />
    <div class="option-container">
      <el-switch v-model="onlyRoot" />
      <el-select size="mini"
                 v-model="type"
                 style="margin-left:10px;width:100px;">
        <el-option v-for="n in allTypes"
                   :key="n"
                   :value="n"
                   :label="$t(`item.${n}`)" />
      </el-select>
    </div>
  </div>
</template>
<script>
import database from '../database'
import VChart from "vue-echarts"
import { use } from 'echarts/core'
import { CanvasRenderer } from "echarts/renderers"
import { PieChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components"
import { formatSpec1 } from '../util/time'

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

const DEFAULT_DATE_TYPE = 'focus'
export default {
  name: 'Main',
  components: {
    VChart
  },
  data () {
    return {
      tableData: [],
      type: DEFAULT_DATE_TYPE, // focus or total
      onlyRoot: true,
      allTypes: ['focus', 'total'],
      option: {
        title: {
          text: this.$t('popup.title'),
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter ({ name, percent, value }) {
            return `${name}<br/>${formatSpec1(value)} (${percent}%)`
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
            name: "Wasted Time",
            type: "pie",
            radius: "55%",
            center: ["62%", "52%"],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            }
          }
        ]
      }
    }
  },
  created () {
    database.refresh(items => {
      this.queryData()
    })
  },
  watch: {
    type () {
      this.queryData()
    },
    onlyRoot () {
      this.queryData()
    }
  },
  methods: {
    queryData () {
      this.tableData = database.select({ date: new Date(), byRoot: this.onlyRoot })
      this.calculateData()
    },
    dateFormatter ({ date }) {
      return `${date.substring(0, 4)} - ${date.substring(4, 6)} - ${date.substring(6, 8)}`
    },
    calculateData () {
      const legendData = []
      const series = []
      this.tableData.forEach(d => {
        legendData.push(d.host)
        series.push({ name: d.host, value: d[this.type] || 0 })
      })
      this.option.legend.data = legendData
      this.option.series[0].data = series
    }
  }
}
</script>
<style scoped>
.app {
  width: 750px;
  height: 440px;
}
.option-container {
  float: right;
  margin-bottom: 10px;
  margin-right: 20px;
}
</style>