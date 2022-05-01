<template>
  <div>
    <!-- {{total}} -->
    <!-- {{goodsList}} -->
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="searchGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="goodsList2" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>

        <el-table-column label="图片预览" prop="imgurl[0].pic" width="95px">
          <template slot-scope="scope">
            <img :src="scope.row.imgurl[0].pic" alt="" width="90px"/>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="商品价格（元）" width="95px" prop="price"></el-table-column>
        <el-table-column label="商品数量" prop="num" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="data" width="140px">
           <!-- <template slot-scope="scope">
             {{scope.row.add_time | dataFormat}}
           </template> -->
        </el-table-column>
        <el-table-column label="操作" width="135px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row._id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
// import jwt_decode from 'jwt-decode'
import jwtdecode from 'jwt-decode'
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示的数据数
        pagesize: 5
      },
      goodsList: [],
      goodsList2: [],
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 搜索
    async searchGoodsList() {
      // 解析token获取id
      const decoded = jwtdecode(window.sessionStorage.token)
      const userid = decoded.id
      // console.log(decoded.id)
      const { data: res } = await this.$http.post('api/allproduct/text', { userid: userid, name: this.queryInfo.query })
      // const { data: res } = await this.$http.get('api/allproduct/getallmes', {
      //   params: this.queryInfo
      // })
      console.log(res)
      if (!res) {
        return this.$message.error('获取商品列表失败！')
      }
      this.$message.success('获取商品列表成功！')
      this.goodsList = res
      console.log(res)
      this.total = this.goodsList.length
      this.goodsList2 = this.goodsList.slice(0, 5)
    },
    // 获取所有商品
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      // 解析token获取id
      const decoded = jwtdecode(window.sessionStorage.token)
      const userid = decoded.id
      // console.log(decoded.id)
      // const pagesnum = this.queryInfo.pagenum * this.queryInfo.pagesize
      // console.log(pagesnum)
      const { data: res } = await this.$http.post('api/allproduct/getallmes', { userid: userid })
      // const { data: res } = await this.$http.get('api/allproduct/getallmes', {
      //   params: this.queryInfo
      // })
      // console.log(res)
      if (!res) {
        return this.$message.error('获取商品列表失败！')
      }
      this.$message.success('获取商品列表成功！')
      this.goodsList = res
      // console.log(res)
      this.total = this.goodsList.length
      this.goodsList2 = this.goodsList.slice(0, 5)
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      // 获取改变的页码
      const newPage = this.queryInfo.pagenum
      const firstpagesnum = (newPage - 1) * newSize
      const lastpagesnum = newPage * newSize
      this.goodsList2 = this.goodsList.slice(firstpagesnum, lastpagesnum)
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
      this.goodsList2 = this.goodsList.slice(firstpagesnum, lastpagesnum)
      // 页码改变
      this.queryInfo.pagenum = newPage
      // this.getGoodsList()
    },
    // 根据id删除对应商品
    async removeById(id) {
      // 弹窗询问用户是否删除
      const result = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除，则返回值为字符串confirm
      // console.log(res)
      if (result !== 'confirm') {
        return this.$message.info('已取消了删除！')
      }
      console.log(id)
      const decoded = jwtdecode(window.sessionStorage.token)
      const userid = decoded.id
      const { data: res } = await this.$http.post('api/allproduct/delete', { _id: id, userid: userid })
      console.log(res)
      if (!res) {
        return this.$message.error('删除商品失败！')
      }
      this.$message.success('该商品成功删除！')
      this.getGoodsList()
    },
    // 点击添加商品按钮，通过编程式导航跳转到添加商品页面
    goAddPage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
