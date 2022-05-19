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
      <!-- 修改商品的对话框 -->
      <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="45%" @close="editDialogClosed">
        <!-- 内容主体区域 -->
        <el-form ref="editFormRef" :model="editForm"  label-width="70px">
          <!-- 用户名 -->
          <el-form-item label="商品名" prop="name">
            <el-input v-model="editForm.name" ></el-input>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item prop="num" label="数量">
            <el-input v-model="editForm.num"></el-input>
          </el-form-item>
          <!-- 手机 -->
          <el-form-item prop="price" label="价格">
            <el-input v-model="editForm.price"></el-input>
          </el-form-item>
          <el-upload
            class="upload-demo"
            :action="uploadURL"
            :on-preview="handlePreview"
            :before-remove="beforeremove"
            :on-remove="handleRemove"
            :auto-upload='false'
            :file-list="fileList"
            :on-change='handleChange'
            accept=".png,.jpg,.jpeg"
            :on-success="handlerSuccess"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          <i class="el-icon-plus"></i>
          </el-upload>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible2()" >取 消</el-button>
          <el-button type="primary" @click="editUser(editForm)">确 定</el-button>
        </span>
      </el-dialog>
      <!-- table表格区域 -->
      <el-table :data="goodsList2" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>

        <el-table-column label="图片预览" prop="imgurl[0].pic" width="95px">
          <template slot-scope="scope" v-lazy>
            <img :src="scope.row.imgurl[0].pic" class="imgurl"/>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="name">
        </el-table-column>
        <el-table-column label="商品价格（元）" width="95px" prop="price"></el-table-column>
        <el-table-column label="商品数量" prop="num" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="data" width="140px">
           <!-- <template slot-scope="scope">
             {{scope.row.add_time | dataFormat}}
           </template> -->
        </el-table-column>
        <el-table-column label="操作" width="135px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row._id)"></el-button>
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
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {
        name: '',
        num: '',
        price: ''
      },
      total: 0,
      // 上传图片的url
      uploadURL: 'https://img.kuibu.net/upload/backblaze',
      // 图片上传组件的headers请求头对象
      // headersObj: {
      //   Authorization: window.sessionStorage.getItem('token')
      // },
      // 预览路径
      previewPath: '',
      // 是否预览
      previewVisable: false,
      fileList: [],
      picInfo22: null
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.fileList = []
      // this.$refs.editFormRef.resetFields()
    },
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
      // console.log(res)
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
      // console.log(id)
      const decoded = jwtdecode(window.sessionStorage.token)
      const userid = decoded.id
      const { data: res } = await this.$http.post('api/allproduct/delete', { _id: id, userid: userid })
      // console.log(res)
      if (!res) {
        return this.$message.error('删除商品失败！')
      }
      this.$message.success('该商品成功删除！')
      this.getGoodsList()
    },
    // 点击添加商品按钮，通过编程式导航跳转到添加商品页面
    goAddPage() {
      this.$router.push('/add')
    },
    // 点击取消编辑
    editDialogVisible2() {
      this.editDialogVisible = false
      this.fileList = []
    },
    // 点击修改按钮，展示修改页面对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.post('api/allproduct/findone', { _id: id })
      if (!res) {
        return this.$message.error('查询用户信息失败！')
      }
      // console.log(res)
      this.editForm = res
      this.editForm.imgurl.map(re => {
        // console.log(re)
        const picInfo = { url: re.pic }
        this.fileList.push(picInfo)
      })
      // console.log(this.fileList)
      this.editDialogVisible = true
    },
    // 点击按钮编辑当前用户
    editUser(editForm) {
      // if (this.picInfo22) {
      this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return 0
        // console.log(this.editForm)
        // this.editForm = editForm
        const { data: res } = await this.$http.post(
          'api/allproduct/addallproduct',
          { _id: this.editForm._id, allproduct: this.editForm }
        )
        // console.log(res)
        if (!res) {
          return this.$message.error('修改用户失败！')
        }
        this.$message.success('更新用户信息成功！')
        // console.log(res)
        // 隐藏添加用户的对话框
        this.editDialogVisible = false
        // 图片清零
        this.fileList = []
        // 重新获取用户列表数据
        this.getGoodsList()
      })
      // }
      // else {
      //   this.$message.error('图片尚未上传成功！')
      // }
    },
    // 处理图片预览的操作
    handlePreview(file) {
      // console.log(file.path)
      // console.log(file.mimetype)
      // console.log(file)
      // if (file) {
      this.previewPath = this.fileList.url
      // } else {
      //   this.previewPath = this.fileList.pic
      // }
      // console.log(this.fileList)
      this.previewVisable = true
      // this.fileList.join({ name: '11', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg' })
    },
    beforeremove() {
      if (this.editForm.imgurl.length === 1) {
        this.$message.error('不能删除最后一张图片！')
        return false
      } else {
        return true
      }
    },
    // 处理图片移除的操作
    handleRemove(file) {
      // 1.获取将要删除的图片的临时路径
      if (this.fileList.length > 1) {
        const filePath = file.url
        // console.log(filePath)
        // 2.从imgurl数组中，找到这个图片对应的索引值
        const idx = this.editForm.imgurl.findIndex(x => x.pic === filePath)
        const idx2 = this.fileList.findIndex(x => x.url === filePath)
        // 3.调用数组的 splice 方法，把图片信息对象，从imgurl数组中移除
        this.editForm.imgurl.splice(idx, 1)
        this.fileList.splice(idx2, 1)
        console.log(this.fileList)
        console.log(this.editForm.imgurl)
      }
      this.handlePreview()
      // console.log(idx)
      // this.fileList = this.editForm.imgurl
    },
    /**
      * 文件上传change
      */
    handleChange(file, fileList) {
      // 获取地址
      const name3 = document.getElementsByClassName('el-upload__input')[0].files[0]
      // const name1 = document.getElementsByClassName('el-upload__input')[0].value
      // const name2 = document.getElementsByClassName('el-upload__input')[0].accept.split(',.')[1]
      // console.log(name1)
      // file.path = name1
      // file.mimetype = name2
      // console.log(name3)
      const formData = new FormData()
      formData.append('test', name3)
      // console.log(file)
      // const config = {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // }
      this.$http.post('api/upload/img', formData).then(res => {
        if (!res) {
          return this.$message.error('获上传失败失败！')
        }
        // console.log(res.data)
        this.fileList.push({ url: res.data })
        this.editForm.imgurl.push({ pic: res.data })
      })
    },
    // 监听图片上传成功的事件
    handlerSuccess(response, file) {
      console.log(file.response.url)
      // 1.拼接得到一个图片信息对象
      const picInfo = { pic: file.response.url }
      this.picInfo22 = picInfo
      // 2.将图片信息对象push到imgurl数组中
      this.editForm.imgurl.push(picInfo)
      // const picInfo2 = { url: file.response.url }
      // this.fileList.push(picInfo2)
    }
  }
}
</script>

<style lang="less" scoped>
.imgurl{
  width: 80px;
  height: 80px;
}
</style>
