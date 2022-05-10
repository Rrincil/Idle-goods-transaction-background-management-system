<template>
  <div class="rights">
    <div class="one">
      <el-row :gutter="24">
        <el-col :span="12" class="one1" >
          <el-row :span="24">
            <el-col :span="12">
              <div class="top">销售金额统计</div>
              <i class="el-icon-wallet" aria-setsize="50px" ></i>
              <div class="xiaoshou">
                3160元
                <p style="color:black; font-size:10px;">销售金额</p>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="top"></div>
              <i class="el-icon-wallet" aria-setsize="50px" ></i>
              <div class="xiaoshou">
                2263元
                <p style="color:black; font-size:10px;">总利润</p>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <!-- <el-col :span="1" ></el-col> -->
        <el-col :span="12" class="one2">
          <el-row :span="24">
            <el-col :span="8">
              <div class="top">订单统计</div>
              <i class="el-icon-shopping-cart-1" aria-setsize="50px" ></i>
              <div class="xiaoshou">
                3200元
                <p style="color:black; font-size:10px;">已支付订单</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="top"></div>
              <i class="el-icon-wallet" aria-setsize="50px" ></i>
              <div class="xiaoshou">
                400元
                <p style="color:black; font-size:10px;">未支付订单</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="top"></div>
              <i class="el-icon-wallet" aria-setsize="50px" ></i>
              <div class="xiaoshou">
                500元
                <p style="color:black; font-size:10px;">已退款订单</p>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="two">
      <div class="twod1" id="zhu3">

      </div>
      <div class="twod2">
      <el-row :gutter="24">
        <el-col :span="12" id="zhu">
        </el-col>
        <!-- <el-col :span="1" id="zhu">
        </el-col> -->
        <el-col :span="12"  id="zhu2">
        </el-col>
      </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      option3: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#CC00FF',
              width: '100%',
              height: '100%',
              padding: '20px'
            }
          }
        },
        toolbox: {
          // feature: {
          //   dataView: { show: true, readOnly: false },
          //   magicType: { show: true, type: ['line', 'bar'] },
          //   restore: { show: true },
          //   saveAsImage: { show: true }
          // }
        },
        legend: {
          data: ['水果类', '蔬菜类', '肉类']
        },
        xAxis: [
          {
            type: 'category',
            data: ['2020.05.01', '2020.05.01', '2020.05.03', '2020.05.05', '2020.05.07', '2020.05.09', '2020.05.11'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '销售额',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value} 元'
            }
          },
          {
            type: 'value',
            name: '净利润',
            min: 0,
            max: 120,
            interval: 25,
            axisLabel: {
              formatter: '{value} 元'
            }
          }
        ],
        series: [
          {
            name: '水果类',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + '元'
              }
            },
            crossStyle: {
              color: '#CC00FF'
            },
            data: [
              2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
            ]
          },
          {
            name: '肉类',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' 500g/份'
              }
            },
            label: {
              backgroundColor: '#E9EEF3'
            },
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ]
          },
          {
            name: '蔬菜类',
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value + ' °C'
              }
            },
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
        ]
      },
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
            name: '总计',
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
              { value: 1048, name: '水果' },
              { value: 735, name: '蔬菜' },
              { value: 580, name: '肉类' },
              { value: 484, name: '生活用品' },
              { value: 300, name: '其他' }
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
      var myChart3 = echarts.init(document.getElementById('zhu3'))
      const options = {
        title: {
          text: '总计销售额',
          subtext: '单位（元）',
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
            name: '总计',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: '水果' },
              { value: 735, name: '蔬菜' },
              { value: 580, name: '肉类' },
              { value: 484, name: '生活用品' },
              { value: 300, name: '其他' }
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
      myChart3.setOption(this.option3)
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
  /* background-color: white; */
  width: 100%;
  height: 200px;
  padding: 10px;
  margin-bottom: 10px;
}
.oned1{
  background-color: white;
  width: 49%;
  height: 100%;
  float: left;
  /* margin-left: 10px; */
}
.oned2{
  background-color: white;
  width: 48%;
  height: 100%;
  float: left;
  margin-left: 10px;
}
.two{
  width: 100%;
  height: 500px;
}
.twod1{
  background-color: white;
  width: 98%;
  margin:10px;
  height: 500px;
}
.twod2{
  width: 100%;
  margin-left: 10px;
  height: 400px;
}
.twod2d1{
  background-color: white;
  float: left;
  width: 50%;
  height: 300px
}
.twod2d2{
  background-color: rgb(255, 255, 255);
  float: left;
  width: 46.5%;
  height: 300px;
  margin-left: 20px;
}
.rights{
  width: 100%;
  height: 800px;
}
canvas{
  width: 100% !important;
  height: 100% !important;
}
.el-row {
  text-align: center;
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
  box-shadow: 0px 5px 5px 0px rgba(255,255,0,0.5);
}

.el-row:last-child {
  margin-bottom: 0;
}
.el-col-8{
  height: 100%;
  background-color: white;
  border-radius: 4px;

}
.el-col-12{
  height: 100%;
  background-color: white;
  border-radius: 4px;

}
.el-col-1{
  height: 100%;
  border-radius: 4px;
}
.el-col-11{
  height: 100%;
  background-color: white;
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.one1{
  background-color: #eaedf1;
}
.one2{
  background-color: #eaedf1;
}
.top{
  color: rgb(255, 0, 0);
  text-shadow: 10px 5px 5px 10px rgba(138, 34, 34, 0.5);
  font-weight: 900;
  text-align: left;
  text-indent: 1em;
  line-height: 30px;
  width: 100%;
  height: 20%;
}
.el-icon-wallet{
  text-align: center;
  size: 50px;
  line-height: 20px;
  color: rgb(16, 92, 255);
  padding-top: 30px;
  width: 100%;
  height: 10%;
}
.xiaoshou{
  font-size: 20px;
  color: brown;
  width: 100%;
  height: 50%;
}
.el-icon-shopping-cart-1{
  text-align: center;
  size: 50px;
  line-height: 20px;
  color: rgb(12, 57, 255);
  padding-top: 30px;
  width: 100%;
  height: 10%;
}
</style>
