<template>
  <div class="rights">
    <div class="rightstop">
      <el-row :span="24">
        <el-col :span="4">
          <el-button @click="changedata(1)">
            当日
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-button @click="changedata(day)">
            最近{{day}}天
          </el-button >
        </el-col>
        <el-col :span="4">
          <el-button @click="changedata(day1)">
            最近{{day1}}天
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-button @click="changedata(day2)">
            最近{{day2}}天
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-button @click="changedata(day3)">
            最近{{day3}}天
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-button @click="changedata(day4)">
            最近{{day4}}天
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="one">
      <el-row :gutter="24">
        <el-col :span="12" class="one1" >
          <el-row :span="24">
            <el-col :span="12">
              <div class="top">销售金额统计</div>
              <i class="el-icon-wallet" aria-setsiiteme="50px" ></i>
              <div class="xiaoshou">
                {{sale}}元
                <p style="color:black; font-siiteme:10px;">销售金额</p>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="top"></div>
              <i class="el-icon-wallet" aria-setsiiteme="50px" ></i>
              <div class="xiaoshou">
                {{OrderPaid}}元
                <p style="color:black; font-siiteme:10px;">已支付订单</p>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <!-- <el-col :span="1" ></el-col> -->
        <el-col :span="12" class="one2">
          <el-row :span="24">
            <el-col :span="8">
              <div class="top">订单统计</div>
              <i class="el-icon-shopping-cart-1" aria-setsiiteme="50px" ></i>
              <div class="xiaoshou">
                {{unpaidOrder}}元
                <p style="color:black; font-siiteme:10px;">未支付订单</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="top"></div>
              <i class="el-icon-wallet" aria-setsiiteme="50px" ></i>
              <div class="xiaoshou">
                {{UnrefundedOrder}}元
                <p style="color:black; font-siiteme:10px;">未退款订单</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="top"></div>
              <i class="el-icon-wallet" aria-setsiiteme="50px" ></i>
              <div class="xiaoshou">
                {{OrderRefunded}}元
                <p style="color:black; font-siiteme:10px;">已退款订单</p>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <div class="two">
      <div class="twod1" id="itemhu3">

      </div>
      <div class="twod2">
      <el-row :gutter="24">
        <el-col :span="12" id="itemhu">
        </el-col>
        <!-- <el-col :span="1" id="itemhu">
        </el-col> -->
        <el-col :span="12"  id="itemhu2">
        </el-col>
      </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import jwtdecode from 'jwt-decode'
import echarts from 'echarts'
export default {
  data() {
    return {
      day: 7,
      day1: 14,
      day2: 21,
      day3: 30,
      day4: 60,
      sale: 316,
      OrderPaid: 226,
      UnrefundedOrder: 320,
      unpaidOrder: 116,
      OrderRefunded: 52,
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
            data: ['2022-05-14', '2022-05-17', '2022-05-18', '2022-05-19', '2022-05-20', '2022-05-21'],
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
            max: 320,
            interval: 50,
            axisLabel: {
              formatter: '{value} 元'
            }
          },
          {
            type: 'value',
            name: '已支付订单',
            min: 0,
            max: 320,
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
                fontSiiteme: '40',
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
      var myChart = echarts.init(document.getElementById('itemhu'))
      var myChart2 = echarts.init(document.getElementById('itemhu2'))
      var myChart3 = echarts.init(document.getElementById('itemhu3'))
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
    },
    // 功能：将浮点数四舍五入，取小数点后2位
		toDecimal(x) {
			let f = parseFloat(x)
			if (isNaN(f)) {
				return
			}
			f = Math.round(x*100)/100;
			return f
		},
    async getdatalist(x) {
      // 3.基于准备好的dom，初始化echarts实例
      // const decoded = jwtdecode(window.sessionStorage.token)
      // const userid = decoded.id
      // var myChart3 = echarts.init(document.getElementById('itemhu3'))
      // const { data: res } = await this.$http.post('api/report/getallmes', { userid: userid })
      // if (!res) {
      //   return this.$message.error('获取折线图数据失败！')
      // }
      // // 4.准备数据和配置项(res.data)
      // const result = _.merge(res[1], this.options)
      // this.option3.xAxis[0].data = res[1].xAxis[0].data
      // console.log(this.option3.xAxis[0].data)
      // console.log(res[1].xAxis[0].data)
      // myChart3.setOption(this.option3)
      var myChart3 = echarts.init(document.getElementById('itemhu3'))
      // 7天
      const data4 = ['2022-05-14', '2022-05-17', '2022-05-18', '2022-05-19', '2022-05-20', '2022-05-21']
      // 14天
      const data = ['2020.05.7', '2020.05.10', '2020.05.13', '2020.05.15', '2020.05.17', '2020.05.19', '2020.05.21']
      // 21 天
      const data1 = ['2022-05-1', '2022-05-5', '2022-05-10', '2022-05-14', '2022-05-18', '2022-05-21']
      // 30 天
      const data2 = ['2022-04-21', '2022-04-30', '2022-05-11', '2022-05-15', '2022-05-18', '2022-05-21']
      // 60 天
      const data3 = ['2022-03-21', '2022-04-10', '2022-04-21', '2022-05-1', '2022-05-18', '2022-05-21']
      const z = [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
      const z1 = [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
      const z2 = [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
      if (x === 7 || x === 1) {
        this.option3.xAxis[0].data = data4
        this.option3.xAxis[0].data = data3
        z.forEach((item,index)=>{
          z[index] = item *1
        })
        this.option3.series[0].data = z
        z1.forEach((item,index)=>{
          z1[index] = item *1
        })
        this.option3.series[1].data = z1
        z2.forEach((item,index)=>{
          z2[index] = item *1
        })
        console.log(z2)
        this.option3.series[2].data = z2
        myChart3.setOption(this.option3)
      }else if(x === 14) {
        this.option3.xAxis[0].data = data
        z.forEach((item,index)=>{
          z[index] = item *x
        })
        this.option3.series[0].data = z
        z1.forEach((item,index)=>{
          z1[index] = item *x
        })
        this.option3.series[1].data = z1
        z2.forEach((item,index)=>{
          z2[index] = item *x
        })
        this.option3.series[2].data = z2
        myChart3.setOption(this.option3)
      }else if(x === 21) {
        this.option3.xAxis[0].data = data1
        z.forEach((item,index)=>{
          z[index] = item *x
        })
        this.option3.series[0].data = z
        z1.forEach((item,index)=>{
          z1[index] = item *x
        })
        this.option3.series[1].data = z1
        z2.forEach((item,index)=>{
          z2[index] = item *x
        })
        this.option3.series[2].data = z2
        console.log(this.option3.series)
        myChart3.setOption(this.option3)
      }else if(x === 30) {
        this.option3.xAxis[0].data = data2
        z.forEach((item,index)=>{
          z[index] = item *21
        })
        this.option3.series[0].data = z
        z1.forEach((item,index)=>{
          z1[index] = item *21
        })
        this.option3.series[1].data = z1
        z2.forEach((item,index)=>{
          z2[index] = item *21
        })
        this.option3.series[2].data = z2
        myChart3.setOption(this.option3)
      }else if(x === 60) {
        this.option3.xAxis[0].data = data3
        z.forEach((item,index)=>{
          z[index] = item *21
        })
        this.option3.series[0].data = z
        z1.forEach((item,index)=>{
          z1[index] = item *21
        })
        this.option3.series[1].data = z1
        z2.forEach((item,index)=>{
          z2[index] = item *21
        })
        this.option3.series[2].data = z2
        myChart3.setOption(this.option3)
      }
    },
    changedata(x) {
      if (x <= 21 && x > 7) {
        this.sale = this.toDecimal(320 * (0.45 * x))
        this.OrderPaid = this.toDecimal(236 * (0.98 * x))
        this.UnrefundedOrder = this.toDecimal(100 * (0.45 * x))
        this.unpaidOrder = this.toDecimal(200 * (0.45 * x))
        this.OrderRefunded = this.toDecimal(136 * (0.45 * x))
        this.option3.yAxis[0].max = this.sale + 200
        this.option3.yAxis[0].interval = 50 * x
        this.option3.yAxis[1].max = this.sale + 200
        this.option3.yAxis[1].interval = 50 * x
        this.getList()
        this.getdatalist(x)
      } else if (x === 1 ||x===7 ) {
        this.option3.yAxis[0].max = 320
        this.option3.yAxis[0].interval = 50 * 1
        this.option3.yAxis[1].max = 320
        this.option3.yAxis[1].interval = 50 * 1
        this.sale = 316
        this.OrderPaid = 226
        this.UnrefundedOrder = 320
        this.unpaidOrder = 116
        this.OrderRefunded = 52
        this.getList()
        this.getdatalist(x)
      } else{
        this.sale = this.toDecimal(320 * (0.45 * 21))
        this.OrderPaid = this.toDecimal(236 * (0.98 * 21))
        this.UnrefundedOrder = this.toDecimal(100 * (0.45 * 21))
        this.unpaidOrder = this.toDecimal(200 * (0.45 * 21))
        this.OrderRefunded = this.toDecimal(136 * (0.45 * 21))
        this.option3.yAxis[0].max = this.toDecimal(this.sale + 200)
        this.option3.yAxis[0].interval = 50 * 21
        this.option3.yAxis[1].max = this.toDecimal(this.sale + 200)
        this.option3.yAxis[1].interval = 50 * 21
        this.getList()
        this.getdatalist(x)
      }
    }
  },
  mounted() {
    const decoded = jwtdecode(window.sessionStorage.token)
    const userid = decoded.id
    if(userid==='62870621b1bc7ea6c90fb04e') {
      this.sale=0,
      this.OrderPaid = 0,
      this.UnrefundedOrder = 0,
      this.unpaidOrder = 0,
      this.OrderRefunded= 0
      this.option3= []
      this.option2=[]
      this.option = []
    }else{
      this.getList()
    }

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

}

.el-row:last-child {
  margin-bottom: 0;
}
.el-col-8{
  height: 100%;
  background-color: white;
  border-radius: 4px;

}
.el-col-4{
  line-height: 10px;
  padding-top: 10px;
  background-color: white;
  height: 100%;
}
.el-col-4 el-button{
  margin-top: 10px;
}
.el-col-12{
  height: 100%;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0px 5px 5px 0px rgba(255,255,0,0.5);
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
  color: rgb(110, 58, 58);
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
  siiteme: 50px;
  line-height: 20px;
  color: rgb(16, 92, 255);
  padding-top: 30px;
  width: 100%;
  height: 10%;
}
.xiaoshou{
  font-siiteme: 20px;
  color: brown;
  width: 100%;
  height: 50%;
}
.el-icon-shopping-cart-1{
  text-align: center;
  siiteme: 50px;
  line-height: 20px;
  color: rgb(12, 57, 255);
  padding-top: 30px;
  width: 100%;
  height: 10%;
}
.rightstop{
  width: 100%;
  height: 60px;
  /* background-color: blueviolet; */
}
</style>
