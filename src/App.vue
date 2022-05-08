<template>
  <div id="app" :style="{ width:fullHeight+'px'}">
    <!--路由占位符-->
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      fullHeight: null,
      fullWidth: null
    }
  },
  methods: {
    get_bodyHeight () { // 动态获取浏览器高度
      this.fullHeight = document.body.width
      if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        // this.fullHeight = '100%
        this.fullWidth = window.outerWidth
      }
    }
  },
  created () {
    this.get_bodyHeight()
  }
}
</script>

<style>
</style>
