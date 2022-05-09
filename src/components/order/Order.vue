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
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="serialNo"></el-table-column>
        <el-table-column label="订单价格" prop="price"></el-table-column>
        <el-table-column label="是否付款" prop="ispay">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.ispay === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
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
            <!-- 修改按钮 -->
            <el-button
              @click="showEditDialog(scope.row.id)"
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
    <el-dialog title="分配角色" :visible.sync="addressVisible" width="45%" @close="addressDialogClosed">
      <!-- 内容主体区域 -->
      <el-form ref="addressFormRef" :model="addressForm" :rules="addressFormRules" label-width="100px">
        <!-- 省市区/县 -->
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <!-- 详细地址 -->
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物资信息" :visible.sync="progressVisible" width="45%" @close="addressDialogClosed">
      <el-timeline>
        <p>{{progressInfo.name}}</p>
        <p>{{progressInfo.num}}</p>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
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
      orderList: [],
      total: 0,
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
      progressInfo: [],
      data: '2022.05.04'
    }
  },
  created() {
    this.getOrderList()
  },
  computed: {},
  methods: {
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
      console.log(res)
      this.orderList = res
      this.total = this.orderList.length
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 展示修改按钮的对话框
    showEditDialog() {
      this.addressVisible = true
    },
    // 展示物流进度的对话框
    async showProgressBox(item) {
      this.progressInfo = item
      this.progressVisible = true
      // console.log(item)
    },
    // 监听对话框的关闭事件
    addressDialogClosed() {
      this.progressVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
.el-cascader{
  width: 100%;
}
</style>
