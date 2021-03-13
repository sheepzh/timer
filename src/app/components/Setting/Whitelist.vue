<template>
  <div>
    <el-alert type="success"
              :title="$t('setting.whitelist.infoAlert')"
              style="margin-bottom:20px;" />
    <div class="icon-container">
      <el-tag v-for="(white,i) in whitelist"
              type="primary"
              closable
              :key="i"
              @close="handleClose(white)">
        {{ white }}
      </el-tag>
      <el-input class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm">
      </el-input>
      <el-button v-else
                 class="button-new-tag"
                 size="small"
                 @click="showInput">+ New Tag</el-button>
    </div>
  </div>
</template>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 140px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
<script>
import { FAVICON } from '../../../util/constant'
import whitelistService from '../../../service/whitelist-service'
export default {
  data () {
    return {
      whitelist: [],
      inputVisible: false,
      inputValue: ''
    }
  },
  created () {
    whitelistService.listAll(list => this.whitelist = list)
  },
  methods: {
    handleClose (url) {
      this.$confirm(this.$t('setting.whitelist.removeConfirmMsg', { url }), this.$t('setting.whitelist.confirmTitle'))
        .then(() => {
          whitelistService.remove(url, () => {
            this.$message({ type: 'success', message: this.$t('setting.whitelist.successMsg') })
            const index = this.whitelist.indexOf(url)
            index !== -1 && this.whitelist.splice(index, 1)
            console.log(this.whitelist, index, url)
          })
        }).catch(() => { })
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => this.$refs.saveTagInput.$refs.input.focus())
    },
    handleInputConfirm () {
      const inputValue = this.inputValue
      if (inputValue) {
        if (this.whitelist.includes(inputValue)) {
          this.$message({ type: 'warning', message: this.$t('setting.whitelist.duplicateMsg') })
        }
        this.$confirm(
          this.$t('setting.whitelist.addConfirmMsg', { url: `${inputValue}<img src="${FAVICON(inputValue)}" width="15px" height="15px">` }),
          this.$t('setting.whitelist.confirmTitle'), { dangerouslyUseHTMLString: true }
        )
          .then(r => {
            whitelistService.add(inputValue, () => {
              this.whitelist.push(inputValue)
              this.$message({ type: 'success', message: this.$t('setting.whitelist.successMsg') })
            })
          }).catch(() => { })
      }
      // Clear input anyway
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>