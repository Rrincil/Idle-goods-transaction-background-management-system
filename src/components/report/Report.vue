<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 2.为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" class="report"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入echarts
// simport  form '../../'
import jwtdecode from 'jwt-decode'
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      /* 需要合并的数据 */
      options: {
        title: {
          text: '销售数据'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {},
  async mounted() {
    // 3.基于准备好的dom，初始化echarts实例
    const decoded = jwtdecode(window.sessionStorage.token)
    const userid = decoded.id
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.post('api/report/getallmes', { userid: userid })
    console.log(res)
    if (!res) {
      return this.$message.error('获取折线图数据失败！')
    }
    console.log(res[0])
    // 4.准备数据和配置项(res.data)
    const result = _.merge(res[0], this.options)
    console.log(result)
    // 5.使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  },
  computed: {},
  methods: {}
}
</script>

<style  scoped>
.report{
  width: 100%;
  height: 500px;
}
</style>
