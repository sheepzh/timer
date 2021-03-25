<template>
  <div class="content-container">
    <div class="filter-container">
      <el-select placeholder="ceshi"
                 v-model="trenderDomain"
                 multiple
                 filterable
                 remote
                 :remote-method="queryDomainHandler"
                 :loading="trenderSearching">
        <el-option v-for="option in trenderDomainOptions"
                   :key="option"
                   :label="option"
                   :value="option" />
      </el-select>
    </div>
  </div>
</template>
<script>
import timerService from '../../../service/timer-service'
export default {
  name: 'Trender',
  data () {
    return {
      trenderDomain: '',
      trenderSearching: false,
      trenderDomainOptions: []
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