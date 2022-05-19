<template>
  <div id="app" :style="{ width:fullHeight+'px'}">
    <!--路由占位符-->
    <audio id="myaudio" src="./assets/mes.mp3" autoplay="autoplay"  muted="muted"></audio>
     <audio id="myaudio2" src="./assets/unmes.mp3" autoplay="autoplay"  muted="muted"></audio>
    <router-view></router-view>

  </div>
</template>

<script>
import jwtdecode from 'jwt-decode'
import { Notification } from 'element-ui';
export default {
  name: 'app',
  data () {
    return {
      fullHeight: null,
      fullWidth: null,
      orderList: null,
      total: 0
    }
  },
  methods: {
    get_bodyHeight () { // 动态获取浏览器高度
      this.fullHeight = document.body.width
      if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        // this.fullHeight = '100%
        this.fullWidth = window.outerWidth
      }
    },
    // 获取订单数据列表
    async getOrderList() {
      const decoded = jwtdecode(window.sessionStorage.token)
      const userid = decoded.id
      let audioPlay = document.getElementById('myaudio')
      console.log(audioPlay);
      const { data: res } = await this.$http.post('api/order/backgetallmes', { userid: userid })
      if (!res) {
        return this.$message.error('获取订单列表失败！')
      }
      // console.log(res)
      this.orderList = res
      this.total  = this.orderList.length

    },
    async getOrderList2() {
      const decoded = jwtdecode(window.sessionStorage.token)
      const userid = decoded.id
      let audioPlay = document.getElementById('myaudio')
      let audioPlay2 = document.getElementById('myaudio2')
      // console.log(audioPlay);
      const { data: res } = await this.$http.post('api/order/backgetallmes', { userid: userid })
      if (!res) {
        return this.$message.error('获取订单列表失败！')
      }
      // console.log(res)

      if(res.length > this.total){
        this.$bus.$emit('order',res)
        audioPlay.play();
        this.Notification({
          title: '您有一个新的订单',
          message:`${res[res.length-1].num}份${res[res.length-1].name}`,
          duration: 0,
          position: 'top-right'
        })
        this.orderList = res
        this.total  = this.orderList.length
        window.sessionStorage.setItem('mes', 0)
      }else if(res.length < this.total){
        this.$bus.$emit('order',res)
        audioPlay2.play();
        this.open2()
        this.orderList = res
        this.total  = this.orderList.length
        window.sessionStorage.setItem('mes', 0)
      }
    },
    open() {
      this.Notification({
        title: '订单消息',
        message:'您有一个新的订单',
        duration: 0,
        position: 'top-right'
      })
    },
    open2() {
      this.Notification({
        title: '订单消息',
        message:'您订单被取消',
        duration: 0,
        position: 'top-right'
      })
    },
    mes() {
      setInterval(()=>{
        window.sessionStorage.setItem('mes', 1)
        this.getOrderList2()
        // console.log(window.sessionStorage.getItem('mes'));
      }, 10000);
    }

  },
  created () {
    this.get_bodyHeight()
    this.getOrderList()

  },
  mounted (){
    this.mes()
  }
}
</script>

<style>
</style>
