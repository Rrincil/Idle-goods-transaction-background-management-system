<template>
  <div class="rights">
    <div class="one">
    </div>
    <div class="two">
      <div class="twod1">

      </div>
      <div class="twod2">
        <div class="twod2d1" id="zhu">

        </div>
        <div class="twod2d2" id="zhu2">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      option2: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ]
          }
        ]
      }
    }
  },
  methods: {
    getList() {
      var myChart = echarts.init(document.getElementById('zhu'))
      var myChart2 = echarts.init(document.getElementById('zhu2'))
      const options = {
        title: {
          text: 'Referer of a Website',
          subtext: 'Fake Data',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(options)
      myChart2.setOption(this.option2)
    }
  },
  mounted() {
    this.getList()
  },
  created() {
    // 获取所有的权限
    // this.getList()
  }
}
</script>

<style scoped>
.one{
  background-color: white;
  width: 100%;
  height: 200px;
  margin-bottom: 10px;
}
.two{
  width: 100%;
  height: 500px;
}
.twod1{
  background-color: white;
  width: 49%;
  float: left;
  margin-left: 5px;
  height: 100%;
}
.twod2{
  width: 49%;
  float: left;
  margin-left: 10px;
  height: 100%;
}
.twod2d1{
  background-color: white;
  width: 100%;
  height: 50%;
}
.twod2d2{
  background-color: white;
  width: 100%;
  height: 49%;
  margin-top: 10px;
}
.rights{
  width: 100%;
  height: 800px;
}
</style>
