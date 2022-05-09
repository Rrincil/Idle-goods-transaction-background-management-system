<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert type="warning" title="注意：只需为第一级分类设置相关参数" :closable="false" show-icon></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            :options="cateList"
            placeholder="请选择"
            v-model="catvalue"
            :props="cascaderProps"
            clearable
            >
          </el-cascader>
          <el-button
            size="mini"
            type="primary"
            :disabled="isBtnDisabled"
            @click="getParamsData"
          >查询</el-button>
          <!-- <el-select v-model="catvalue" placeholder="请选择">
            <el-option
              v-for="item in cateList"
              :key="item"
              :label="item.label"
              :value="item.cat_name"
              @change="parentCateChange"
              >
            </el-option> -->
          <!-- </el-select> -->
          <!-- <el-cascader
            expandTrigger="hover"
            :options="cateList"
            v-model="value"
            :props="cateProps"
            @change="parentCateChange"
            clearable
            checkStrictly
          ></el-cascader> -->
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            size="mini"
            type="primary"
            :disabled="isBtnDisabled"
            @click="addDialogVisibleTO()"
          >修改参数</el-button>
          <!-- 动态参数表格 -->
          <!-- <el-table  border stripe> -->
            <p v-show="isparams" class="params">{{paramsname}}{{params}}</p>
          <!-- </el-table> -->
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'修改'+ titleText + '动态参数'"
      :visible.sync="addDialogVisible"
      width="45%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <!-- 分类名称 -->
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 邮箱 -->
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改'+ titleText"
      :visible.sync="editDialogVisible"
      width="45%"
      @close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="100px">
        <!-- 分类名称 -->
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 邮箱 -->
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import jwtdecode from 'jwt-decode'
export default {
  data() {
    return {
      // 商品分类列表
      cateList: [],
      params: '',
      attrname: '',
      isparams: false,
      catvalue: null,
      paramsitem: '',
      paramsname: '',
      // 级联选择框的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        checkStrictly: true
      },
      // 选中的父级分类的id数组
      // value: [],
      // 激活的页签名字
      activeName: 'many',
      // 动态参数的数据
      manyTabelData: [],
      // 静态属性的数据
      onlyTabelData: [],
      // 控制对话框的显示与隐藏
      addDialogVisible: false,
      editDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {},
      // 修改参数的表单数据对象
      editForm: {},
      // 验证规则的对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCatList()
  },
  computed: {
    // 如果按钮按钮需要被禁用，则返回true，否则返回false
    isBtnDisabled() {
      if (this.catvalue === null) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的id
    cateId() {
      if (this.catvalue !== null) {
        return this.catvalue
      }
      return null
    },
    // 动态计算对话框标题的文本
    titleText() {
      return this.paramsitem.cat_name
    }
  },
  methods: {
    // 获取所有商品分类列表
    async getCatList() {
      const decoded = jwtdecode(window.sessionStorage.token)
      const userid = decoded.id
      // console.log(userid)
      const { data: res } = await this.$http.post('api/categorie/getallmes', { userid: userid })
      if (!res) {
        return this.$message.error('获取商品分类失败！')
      }
      this.cateList = res
      // console.log(this.cateList)
    },
    // 监听选择项变化事件
    parentCateChange() {
      // console.log(111)
      this.getParamsData()
    },
    // tab 页签点击事件的处理函数
    handleTabClick() {
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData() {
      // console.log(this.catvalue)
      const decoded = jwtdecode(window.sessionStorage.token)
      const userid = decoded.id
      if (this.catvalue.length === 1) {
        const filePath = this.catvalue[0]
        const idx = this.cateList.findIndex(x => x.cat_id === filePath)
        const item = this.cateList[idx]
        this.paramsitem = item
        this.$http.post('api/categorie/findparams', { cat_id: item.cat_id, userid: userid, cat_level: item.cat_level, cat_pid: item.cat_pid, cat_pid2: item.cat_pid2 }).then(res => {
          if (!res) {
            return this.$message.error('获取数据失败！')
          }
          this.$message.success(res.data.params)
          this.paramsname = item.cat_name
          this.params = res.data.params
          this.isparams = true
          this.addCateDialogVisible = false
          this.manyTabelData = res.data.params
        })
      } else if (this.catvalue.length === 2) {
        const filePath = this.catvalue[0]
        const idx = this.cateList.findIndex(x => x.cat_id === filePath)
        const idx2 = this.cateList[idx].children.findIndex(x => x.cat_id === this.catvalue[1])
        const item = this.cateList[idx].children[idx2]
        this.paramsitem = item
        this.$http.post('api/categorie/findparams', { cat_id: item.cat_id, userid: userid, cat_level: item.cat_level, cat_pid: item.cat_pid, cat_pid2: item.cat_pid2 }).then(res => {
          if (!res) {
            return this.$message.error('获取数据失败！')
          }
          this.$message.success(res.data.params)
          this.paramsname = item.cat_name
          this.params = res.data.params
          this.isparams = true
          this.addCateDialogVisible = false
          this.manyTabelData = res.data.params
        })
      } else if (this.catvalue.length === 3) {
        const filePath = this.catvalue[0]
        const idx = this.cateList.findIndex(x => x.cat_id === filePath)
        const idx2 = this.cateList[idx].children.findIndex(x => x.cat_id === this.catvalue[1])
        const idx3 = this.cateList[idx].children[idx2].children.findIndex(x => x.cat_id === this.catvalue[2])
        const item = this.cateList[idx].children[idx2].children[idx3]
        this.paramsitem = item
        this.$http.post('api/categorie/findparams', { cat_id: item.cat_id, userid: userid, cat_level: item.cat_level, cat_pid: item.cat_pid, cat_pid2: item.cat_pid2 }).then(res => {
          if (!res) {
            return this.$message.error('获取数据失败！')
          }
          this.$message.success(res.data.params)
          this.paramsname = item.cat_name
          this.params = res.data.params
          this.isparams = true
          this.addCateDialogVisible = false
          this.manyTabelData = res.data.params
        })
      }
      // 将attr_vals通过空格进行分割，然后得到数组
      // res.data.forEach(item => {
      //   item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
      //   // 控制文本框的显示与隐藏
      //   item.inputVisible = false
      //   item.inputValue = ''
      // })
      // this.$message.success('获取参数列表成功！')
      // if (this.activeName === 'many') {
      //   this.manyTabelData = res.data
      // } else {
      //   this.onlyTabelData = res.data
      // }
    },
    // 监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 监听确定按钮，添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        console.log(111)
        const decoded = jwtdecode(window.sessionStorage.token)
        const userid = decoded.id
        const item = this.paramsitem
        this.$http.post('api/categorie/edit', { cat_id: item.cat_id, userid: userid, cat_level: item.cat_level, cat_pid: item.cat_pid, cat_pid2: item.cat_pid2, cateparams: this.addForm.attr_name }).then(res => {
          if (!res) {
            return this.$message.error('修改参数失败！')
          }
          console.log(res)
          this.$message.success(res.data.mes)
          this.addDialogVisible = false
          this.getParamsData()
        })
      })
    },
    addDialogVisibleTO() {
      // this.addForm.attr_name = this.paramsitem.cateparams
      // this.attrname = this.paramsitem.cateparams
      this.addDialogVisible = true
    },
    // 编辑按钮
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { date: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        console.log(res)
        /* if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        } */
        this.$message.success('修改参数成功！')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 删除按钮
    async removeParams(id) {
      // 弹窗询问用户是否删除
      const result = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 如果用户确认删除，则返回值为字符串confirm
      // console.log(res)
      if (result !== 'confirm') {
        return this.$message.info('已取消了删除！')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败！')
      }
      this.$message.success('参数成功删除！')
      this.getParamsData()
    },
    // 点击编辑按钮，展示修改的对话框
    async showEditDialog(id) {
      // 查询当前参数的信息
      const { data: res } = await this.$http.post('api/categorie/findparams', {})
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 文本框失去焦点或按下enter都会触发
    handleInputConfirm(row) {
      if (row.inputValue === '') {
        console.log(1111)
        row.inputValue = ''
        row.inputVisible = false
      }
      // 输入了内容，进行后续处理
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      row.inputVisible = false
      // 将新加入的标签通过http请求存入数据库中
      this.saveAttrVals(row)
    },
    // 点击按钮展示文本输入框
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 保存attr_vals到数据库
    async saveAttrVals(row) {
      // 将新加入的标签通过http请求存入数据库中
      console.log(row)
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }
      this.$message.success('修改参数项成功！')
    },
    // 监听tag标签的删除事件
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
.params{
  text-align: center;
  color: rgb(189, 67, 67);
  font-weight: 900;
  font-size: 50px;
}
</style>
