<template>
  <div id="app">
    <el-container>
      <el-aside>
        <el-menu :default-active="$route.path">
          <template v-for="({title,route,icon,children}) in menu">
            <el-submenu v-if="children&&children.length"
                        :key="title"
                        :index='route'>
              <template slot="title">
                <i :class="`el-icon-${icon}`" />
                <span> {{ $t(title) }}</span>
              </template>
              <el-menu-item v-for="child in children"
                            :key="title+'-'+child.title"
                            :index="child.route"
                            @click="openMenu(child.route, child.title)">
                <i :class="`el-icon-${child.icon}`"></i>
                <span slot="title"> {{ $t(child.title) }} </span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else
                          :key="title"
                          :index="route"
                          @click="openMenu(route, title)">
              <i :class="`el-icon-${icon}`"></i>
              <span slot="title">
                {{ $t(title) }}
              </span>
            </el-menu-item>
          </template>
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
          title: 'menu.data',
          icon: 's-platform',
          route: '/data',
          children: [
            {
              title: 'menu.dataReport',
              route: '/data/report',
              icon: 'date'
            }, {
              title: 'menu.dataHistory',
              route: '/data/history',
              icon: 'stopwatch'
            }
          ]
        }, {
          title: 'menu.setting',
          route: '/setting',
          icon: 'setting'
        }
      ]
    }
  },
  created () {
    document.title = this.$t('menu.data')
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