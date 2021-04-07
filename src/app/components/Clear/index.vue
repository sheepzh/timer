<template>
  <div class="content-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card :body-style="cardStyle">
          <el-alert show-icon
                    center
                    :title="$t('clear.totalMemoryAlert',{ size:totalMb })"
                    :closable="false"
                    type="info" />
          <div style="height:260px; padding-top:50px;">
            <el-progress :stroke-width="15"
                         :percentage="percentage"
                         type="circle"
                         :color="typeColor" />
          </div>
          <div style="user-select: none;">
            <h3 :style="`color:${typeColor}`">{{ $t('clear.usedMemoryAlert',{ size:usedMb }) }}</h3>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card :body-style="cardStyle">
          <el-alert show-icon
                    center
                    :title="$t('clear.operationAlert')"
                    :closable="false"
                    type="info" />
          <clear-filter @dataChanged="queryStorageInfo()" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss">
.el-progress-circle {
  width: 250px !important;
  height: 250px !important;
  margin: auto;
}
</style>
<script>
import { getUsedStorage } from '../../../database/memory-detector'
import ClearFilter from './Filter'
const byte2Mb = size => Math.round((size || 0) / 1024.0 / 1024.0 * 1000) / 1000
export default {
  name: 'DataClear',
  components: { ClearFilter },
  data () {
    return {
      used: 0,
      total: 1,
      cardStyle: {
        height: '450px',
        textAlign: 'center'
      }
    }
  },
  created () {
    this.queryStorageInfo()
  },
  methods: {
    queryStorageInfo () {
      getUsedStorage((used, total) => {
        this.used = used || 0
        this.total = total || 1
      })
    }
  },
  computed: {
    percentage () {
      return Math.round(this.used * 10000.0 / this.total) / 100
    },
    /**
     * Total limited size with MB
     */
    totalMb () {
      return byte2Mb(this.total)
    },
    usedMb () {
      return byte2Mb(this.used)
    },
    /**
     * The color of pregress and used-info alert
     */
    typeColor () {
      const percentage = this.percentage
      if (percentage < 50) {
        // Primary color
        return '#409EFF'
      } else if (percentage < 75) {
        // Warning color
        return '#E6A23C'
      } else {
        // Danger color
        return '#F56C6C'
      }
    }
  }
}
</script>