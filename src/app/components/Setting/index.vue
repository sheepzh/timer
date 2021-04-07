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
      <el-tag size="small"
              type="info"
              class="info-item point-item"
              @click="openIssuePage()">{{ $t('setting.issueRequest') }}</el-tag>
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
import { HOME_PAGE, GITHUB_ISSUE_ADD } from '../../../util/constant/url'
import Whitelist from './Whitelist'
export default {
  name: 'Setting',
  components: { Whitelist },
  data () {
    return {
      version,
      homePage: HOME_PAGE,
      issueAddPage: GITHUB_ISSUE_ADD
    }
  },
  methods: {
    openHomePage () {
      window.open(this.homePage, "_blank")
    },
    openIssuePage () {
      window.open(this.issueAddPage, "_blank")
    }
  }
}
</script>