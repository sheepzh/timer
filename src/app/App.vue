<template>
  <div id="app">
    <el-container>
      <el-aside>
        <el-menu :default-active="$route.path">
          <el-menu-item v-for="({title,route,icon}) in menu"
                        :key="title"
                        :index="route"
                        @click="openMenu(route, title)">
            <i :class="`el-icon-${icon}`"></i>
            <span slot="title">
              {{ $t(title) }}
            </span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container class="app-container">
        <router-view />
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'App',
  data () {
    return {
      menu: [
        {
          title: 'menu.record',
          route: '/record',
          icon: 's-platform'
        }, {
          title: 'menu.setting',
          route: '/setting',
          icon: 'setting'
        }
      ]
    }
  },
  created () {
    document.title = this.$t('menu.record')
  },
  methods: {
    openMenu (route, title) {
      if (this.$route.path !== route) {
        this.$router.push(route)
        document.title = this.$t(title)
      }
    }
  }
}
</script>
<style >
.content-container {
  padding: 0 30px;
  padding-bottom: 10px;
}
</style>