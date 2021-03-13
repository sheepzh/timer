<template>
  <div class="content-container">
    <div class="info-head">
      <el-tag size="small"
              type="info"
              class="info-item">{{$t('app.currentVersion',{ version })}}</el-tag>
      <el-tag v-if="homePage"
              size="small"
              type="info"
              class="info-item point-item"
              @click="openHomePage()">{{ $t('setting.scoreRequest') }}</el-tag>
    </div>
    <el-tabs type="border-card">
      <el-tab-pane :label="$t('setting.whitelist.label')">
        <whitelist />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style scoped>
.info-head {
  margin-bottom: 10px;
}
.info-item {
  margin-right: 5px;
}
.point-item {
  cursor: pointer;
}
</style>
<script>
const { version } = require('../../../../package.json')
import { HOME_PAGE } from '../../../util/constant'
import Whitelist from './Whitelist'
export default {
  name: 'Setting',
  components: { Whitelist },
  data () {
    return {
      version,
      homePage: HOME_PAGE
    }
  },
  methods: {
    openHomePage () {
      window.open(this.homePage, "_blank")
    }
  }
}
</script>