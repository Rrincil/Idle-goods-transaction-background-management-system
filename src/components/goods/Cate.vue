<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table class="TreeTable" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index border>
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i style="color: lightgreen;" class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
          <i style="color: red;" class="el-icon-error" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <!-- <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button> -->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removecate(scope.row)">删除</el-button>
        </template>
      </tree-table>
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
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="45%" @close="addCateDialogClosed">
     <!-- 内容主体区域 -->
      <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules" label-width="100px">
        <!-- 分类名称 -->
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <!-- 分类参数 -->
        <el-form-item label="分类参数：" prop="cateparams">
          <el-input v-model="addCateForm.cateparams"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item  label="父级分类：">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
            <el-cascader
              :options="cateList"
              v-model="selectedKeys"
              :props="cascaderProps"
              clearable
              >
            </el-cascader>
          <!-- <el-cascader  :options="parentCateList" v-model="selectedKeys" :props="cascaderProps" @change="parentCateChange" clearable checkStrictly></el-cascader> -->
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate(addCateForm)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import jwtdecode from 'jwt-decode'
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表
      cateList: [],
      // 总数据条数
      total: 0,
      catid: '',
      // 为table指定列的定义
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        // 将当前列指定为模板列
        type: 'template',
        template: 'isOk'
      }, {
        label: '排序',
        // 将当前列指定为模板列
        type: 'template',
        template: 'order'
      }, {
        label: '操作',
        // 将当前列指定为模板列
        type: 'template',
        template: 'opt'
      }],
      // 控制添加分类的对话框
      addCateDialogVisible: false,
      // 添加分类的数据对象
      addCateForm: {
        // 添加分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认分类的是1级分类
        cat_level: 0
      },
      // 添加分类表单的验证对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        cateparams: [
          { required: true, message: '请输入分类参数', trigger: 'blur' }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        checkStrictly: true
      },
      // 选中的父级分类的id数组
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const decoded = jwtdecode(window.sessionStorage.token)
      const userid = decoded.id
      const { data: res } = await this.$http.post('api/categorie/getallmes', { userid: userid })
      if (!res) {
        return this.$message.error('获取商品分类失败！')
      }
      console.log(res)
      this.cateList = res
      window.sessionStorage.setItem('cate', res)
      this.total = this.cateList.length
      // console.log(this.cateList)
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 监听点击添加分类按钮事件
    showAddCateDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      // const { data: res } = await this.$http.get('api/categorie/getallmes')
      // const { data: res } = await this.$http.get('api/categorie/getallmes', { params: { type: 2 } })
      // if (!res) {
      //   return this.$message.error('获取父级分类数据失败！')
      // }
      this.parentCateList = this.cateList
    },
    // 监听选择项变化事件
    parentCateChange() {
      // 如果selectedKeys数组长度大于0，证明选中了父级分类
      // 反之，说明没有选择任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 分类的等级
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类按钮
    addCate(addCateForm) {
      this.$refs.addCateFormRef.validate(async valid => {
        console.log(this.selectedKeys)
        const decoded = jwtdecode(window.sessionStorage.token)
        const userid = decoded.id
        console.log(this.selectedKeys[1])
        console.log(this.addCateForm.cateparams)
        this.$http.post('api/categorie/add', { cat_id: this.selectedKeys, cat_id2: this.cateList.length++, cateparams: this.addCateForm.cateparams, userid: userid, cateList: this.addCateForm, cat_name: this.addCateForm.cat_name, catid11: this.cateList.length }).then(res => {
          if (!res) {
            return this.$message.error('添加分类数据失败！')
          }
          console.log(res)
          this.$message.success(res.data.mes)
          this.getCateList()
          this.addCateDialogVisible = false
        })
      })
    },
    // 监听对话框的关闭事件
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    async removecate(item) {
      console.log(item)
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
      const decoded = jwtdecode(window.sessionStorage.token)
      const userid = decoded.id
      // console.log(userid)
      const { data: res } = await this.$http.post('api/categorie/delete', { cat_id: item.cat_id, userid: userid, cat_level: item.cat_level, cat_pid: item.cat_pid, cat_pid2: item.cat_pid2 })
      // console.log(res)
      if (!res) {
        return this.$message.error('删除分类失败！')
      }
      console.log(res)
      this.$message.success('该分类成功删除！')
      this.getCateList()
    }
  }

}
</script>

<style lang="less" scoped>
.TreeTable{
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>
