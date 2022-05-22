<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表区域 -->
      <el-table :data="orderList2" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="serialNo"></el-table-column>
        <el-table-column label="订单价格" prop="price"></el-table-column>
        <el-table-column label="是否付款" prop="ispay">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.ispay === 2">已退款</el-tag>
            <el-tag type="success" v-if="scope.row.ispay === 1 ">已付款</el-tag>
            <el-tag type="danger" v-if="scope.row.ispay === 0 ">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="usermessage[0].iphone">
        </el-table-column>
        <el-table-column label="地址" prop="usermessage[0].address">
        </el-table-column>
        <el-table-column label="是否发货">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isShip" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="data">
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 退款按钮 -->
            <el-button
              @click="showEditDialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <!-- 物流进度按钮 -->
            <el-button
              @click="showProgressBox(scope.row)"
              type="success"
              icon="el-icon-location"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
    <!-- 修改地址的对话框 -->
    <el-dialog title="退款信息" :visible.sync="addressVisible" width="45%" @close="addressDialogClosed">
      <!-- 内容主体区域 -->
      <el-form ref="addressFormRef" :model="addressForm" :rules="addressFormRules" label-width="100px">
        <!-- 省市区/县 -->
        <el-form-item label="物品" >
          <input v-model="progressInfo.name" disabled style="color:red;width: auto;font-size:30px;"/>
          <!-- <el-cascader :options="cityData" v-model="progressInfo.name" disabled></el-cascader> -->
        </el-form-item>
        <!-- 详细地址 -->
        <el-form-item label="退款金额（元）" >
          <input v-model="progressInfo.price" disabled style="color:red;width: auto;font-size:30px;"/>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary"  @click="refund()">确 定退款</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物资信息" :visible.sync="progressVisible" width="45%" @close="addressDialogClosed">
      <el-timeline v-if="isinfo">
        <img :src="progressInfo.imgurl[0].pic" class="imgurl"/>
        <p class="Infoname">{{progressInfo.name}}</p>
        <p class="Infocateparams">{{progressInfo.num}}份</p>
        <p>电话：{{progressInfo.usermessage[0].iphone}} </p>
        <p>姓名地址：{{progressInfo.usermessage[0].address}} </p>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import md5 from 'js-md5'
import jwtdecode from 'jwt-decode'
import cityData from './citydata'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示的数据数
        pagesize: 10
      },
      orderList2: [],
      orderList: [],
      total: 0,
      ispaycode: 0,
      addressVisible: false,
      progressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      cityData: cityData,
      // 物流信息数据
      progressInfo:{},
      data: '2022.05.04',
      isinfo: false
    }
  },
  created() {
    this.getOrderList()
  },
   mounted() {
    this.$bus.$on("order",this.getgoods)
  },
  computed: {},
  methods: {
    refund(){
      let md =`access_key=f9ce7161e186c5362198524320650236&refund_fee=${this.progressInfo.num*this.progressInfo.price*100}&out_order_no=${this.progressInfo.serialNo}`;
      let s2 = md5(md)
      s2=s2.toUpperCase();
        let u = {
        access_key: "f9ce7161e186c5362198524320650236",
        refund_fee: this.progressInfo.num*this.progressInfo.price*100,
        out_order_no:this.progressInfo.serialNo,
        sign:s2,
      };
      let s = JSON.stringify(u);
      this.$http.post( "https://open.weidoufu.com/pay/refund",
        u,
        {headers: {
          'Content-Type':'application/json;charset=utf-8'      //改这里就好了
        }}).then(
        (response) => {
          console.log(response);
          if(response.data.code === 1) {
            this.$http.post('api/order/editisPay2',{_id:this.progressInfo._id}).then(res=>{
              console.log(res)
              this.$message.success('退款成功！')
            })
          }else {
            this.$message.error('退款失败！')
          }
        },
        (error) => {
          console.log(error.message);
        }
      );
      this.addressVisible = false
    },//退款

    // 是否发货
    userStateChanged(item) {
      console.log(item)
      this.$http.post('api/order/edit', { _id: item._id, isShip: item.isShip }).then(res => {
        if (!res) {
          return this.$message.error('改变发货状态失败！')
        }
        this.$message.success('改变发货状态成功！')
        console.log(res)
      })
    },
    // 获取订单数据列表
    async getOrderList() {
      const decoded = jwtdecode(window.sessionStorage.token)
      const userid = decoded.id
      const { data: res } = await this.$http.post('api/order/backgetallmes', { userid: userid })
      if (!res) {
        return this.$message.error('获取订单列表失败！')
      }
      // console.log(res)
      this.orderList = res
      this.total = this.orderList.length
      this.orderList2 = this.orderList.slice(0, 10)
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      // 获取改变的页码
      const newPage = this.queryInfo.pagenum
      const firstpagesnum = (newPage - 1) * newSize
      const lastpagesnum = newPage * newSize
      this.orderList2 = this.orderList.slice(firstpagesnum, lastpagesnum)
      // 每页显示的数据改变
      this.queryInfo.pagesize = newSize
      console.log(newSize)
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      const newSize = this.queryInfo.pagesize
      // console.log(newPage)
      const firstpagesnum = (newPage - 1) * newSize
      // console.log(firstpagesnum)
      const lastpagesnum = newPage * newSize
      // console.log(lastpagesnum)
      this.orderList2 = this.orderList.slice(firstpagesnum, lastpagesnum)
      // 页码改变
      this.queryInfo.pagenum = newPage
      // this.getorderList()
    },
    // 展示退款按钮的对话框
    showEditDialog(item) {
      this.progressInfo = item
      console.log(item)
      this.addressVisible = true
    },
    // 展示物流进度的对话框
    showProgressBox(item) {
      this.isinfo = true
      this.progressInfo = item
      console.log(item)
      this.progressVisible = true
      // console.log(item)
    },
    // 监听对话框的关闭事件
    addressDialogClosed() {
      this.progressVisible = false
    },

    getgoods(x){
      this.orderList = x
      // console.log(x,'总线')
      // this.progressInfo=x
  },

  }
}
</script>

<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
.el-cascader{
  width: 100%;
}
.Infoname{
  width: 100%;
  height: 20px;
  text-align: center;
  font-weight: 900 !important;
  color: rgb(143, 4, 4) !important;
  font-size: 45px !important;
}
.Infocateparams{
  width: 100%;
  height: 20px;
  text-align: center;
  color: red !important ;
  font-weight: 900 !important;
  font-size: 45px !important;
}
.el-timeline p{
  width: 100%;
  height: 20px;
  text-align: center;
  font-size: 30px;
  font-weight: 900 !important;
  color: rgb(39, 36, 36);
}
.imgurl{
  width: 200px;
  height: 200px;
  margin-left: 30%;
}

</style>
