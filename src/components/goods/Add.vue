<template>
  <div>
    <!-- {{cateList}} -->
    <!-- {{manyTabelData}} -->
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <!-- <el-step title="商品参数"></el-step> -->
        <!-- <el-step title="商品属性"></el-step> -->
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <!-- <el-step title="完成"></el-step> -->
      </el-steps>
      <!-- form表单 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="70px"
        label-position="top"
      >
        <!-- tabs栏区域 -->
        <el-tabs
          v-model="activeIndex"
          :tab-position="tabPosition"
          :before-leave="beforeTabLeave"
          tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item prop="shopname" label="商家名称">
              <el-input v-model="addForm.shopname" placeholder="零售商家"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="商品名称">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item prop="price" label="商品价格">
              <el-input v-model="addForm.price" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="number" label="商品数量">
              <el-input v-model="addForm.number" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="goods_cat" label="商品分类">
              <!-- 选择商品分类的级联选择框 -->
              <el-cascader
                :options="cateList"
                v-model="addForm.goods_cat"
                :props="cateProps"
                @change="parentCateChange"
                clearable
                checkStrictly
              ></el-cascader>
            </el-form-item>
            <el-form-item  label="商品参数规格">
              <input v-model="addForm.params" disabled class="params" style="color:red"/>
            </el-form-item>
          </el-tab-pane>
          <!-- <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTabelData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane> -->
          <!-- <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTabelData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane> -->
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片上传后台api地址 -->

            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-progress="onprogress"
              :file-list="fileList"
              :auto-upload='false'
              :before-upload="onprogress"
              :on-change='handleChange'
              accept=".png,.jpg,.jpeg"
              :on-success="handlerSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            <i class="el-icon-plus"></i>
            </el-upload>
            <!-- <form action="/upload" method="post" enctype="multipart/form-data">
              <h2>单图上传</h2>
              <input type="file" name="logo">
              <input type="submit" value="提交" @click="toimg">
            </form> -->
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisable" width="50%">
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import jwtdecode from 'jwt-decode'
export default {
  data() {
    return {
      // 步骤条下标
      activeIndex: '0',
      // tabs标签栏居左显示
      tabPosition: 'bottom',
      fileList: [],
      addForm: {
        userid: '',
        name: '',
        price: null,
        params: '',
        shopname: '',
        number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        imgurl: [],
        // 商品详情描述
        goods_introduce: ''
        // 动态参数和静态属性数组
        // attrs: []
      },
      addFormRules: {
        // 验证用户名是否合法
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        shopname: [
          { required: true, message: '请输入商家名称', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ],
        params: [
          { required: true, message: '商品参数', trigger: 'blur' }
        ]
      },
      // 商品分类列表
      cateList: [],
      // 级联选择框的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 动态参数和静态属性列表数据
      manyTabelData: [],
      onlyTabelData: [],
      // 上传图片的url
      // uploadURL: 'https://img.kuibu.net/upload/backblaze',
      uploadURL: 'http://p0.so.qhimgs1.com',
      // 图片上传组件的headers请求头对象
      // headersObj: {
      //   Authorization: window.sessionStorage.getItem('token')
      // },
      // 预览路径
      previewPath: '',
      // 是否预览
      previewVisable: false
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    // 获取所有商品分类列表
    getCatList() {
      const decoded = jwtdecode(window.sessionStorage.token)
      const userid = decoded.id
      this.$http.post('api/categorie/getallmes', { userid: userid }).then(res=>{
        if (!res) {
          return this.$message.error('获取商品分类失败！')
        }
        this.cateList = res.data
      })
    },
    // 监听级联选择器变化
    parentCateChange() {
      const decoded = jwtdecode(window.sessionStorage.token)
      const userid = decoded.id
      if (this.addForm.goods_cat.length === 1) {
        const filePath = this.addForm.goods_cat[0]
        const idx = this.cateList.findIndex(x => x.cat_id === filePath)
        const item = this.cateList[idx]
        this.$http.post('api/categorie/findparams', { cat_id: item.cat_id, userid: userid, cat_level: item.cat_level, cat_pid: item.cat_pid, cat_pid2: item.cat_pid2 }).then(res => {
          if (!res) {
            return this.$message.error('获取数据失败！')
          }
          this.addForm.params = res.data.params
        })
      } else if (this.addForm.goods_cat.length === 2) {
        const filePath = this.addForm.goods_cat[0]
        const idx = this.cateList.findIndex(x => x.cat_id === filePath)
        const idx2 = this.cateList[idx].children.findIndex(x => x.cat_id === this.addForm.goods_cat[1])
        const item = this.cateList[idx].children[idx2]
        this.$http.post('api/categorie/findparams', { cat_id: item.cat_id, userid: userid, cat_level: item.cat_level, cat_pid: item.cat_pid, cat_pid2: item.cat_pid2 }).then(res => {
          if (!res) {
            return this.$message.error('获取数据失败！')
          }
          this.addForm.params = res.data.params
        })
      } else if (this.addForm.goods_cat.length === 3) {
        const filePath = this.addForm.goods_cat[0]
        const idx = this.cateList.findIndex(x => x.cat_id === filePath)
        const idx2 = this.cateList[idx].children.findIndex(x => x.cat_id === this.addForm.goods_cat[1])
        const idx3 = this.cateList[idx].children[idx2].children.findIndex(x => x.cat_id === this.addForm.goods_cat[2])
        const item = this.cateList[idx].children[idx2].children[idx3]
        this.$http.post('api/categorie/findparams', { cat_id: item.cat_id, userid: userid, cat_level: item.cat_level, cat_pid: item.cat_pid, cat_pid2: item.cat_pid2 }).then(res => {
          if (!res) {
            return this.$message.error('获取数据失败！')
          }
          this.addForm.params = res.data.params
        })
      }
      // console.log(this.addForm.goods_cat)
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (this.addForm.goods_cat.length === 0) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    async tabClicked() {
      // 动态参数面板
      if (this.activeIndex === '1') {
        // 选中的是3级分类，则根据所选id和name获取对应的参数
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败！')
        }
        // 将attr_vals通过空格进行分割，然后得到数组
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        // console.log(res.data)
        this.manyTabelData = res.data
      } else if (this.activeIndex === '2') {
        // 静态属性面板
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性列表失败！')
        }
        this.onlyTabelData = res.data
      }
    },
    modeUpload(item) {
      console.log(item.file)
      // const formData = new FormData()
      // formData.append('files', item.file)
      // console.log(formData)
      // const { data: res } = this.$http.post(
      //   'https://img.kuibu.net/upload/backblaze', item.file)
      // console.log(res)
    },
    // 处理图片预览的操作
    handlePreview(file) {
      console.log(file)
      console.log(file.path)
      console.log(file.mimetype)
      this.previewPath = file.response.data.url
      this.previewVisable = true
      // this.fileList.join({ name: '11', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg' })
    },
    // 处理图片移除的操作
    handleRemove(file) {
      // 1.获取将要删除的图片的临时路径
      // console.log(file)
      const filePath = file.url
      console.log(this.addForm.imgurl)
      const idx = this.addForm.imgurl.findIndex(x => x.pic === filePath)
        // 3.调用数组的 splice 方法，把图片信息对象，从imgurl数组中移除
      this.addForm.imgurl.splice(idx, 1)
      // const filePath = file.response.url
      // 2.从imgurl数组中，找到这个图片对应的索引值
      // const idx = this.addForm.imgurl.findIndex(x => x.pic === filePath)
      // // 3.调用数组的 splice 方法，把图片信息对象，从imgurl数组中移除
      // this.addForm.imgurl.splice(idx, 1)
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
        this.addForm.imgurl.push({ pic: res.data })
      })
    },
    onprogress(file, fileList) {

    },
    // 监听图片上传成功的事件
    handlerSuccess(response, file) {
      // console.log(file.response.url)
      // console.log(response)
      // console.log(file)
      // // 1.拼接得到一个图片信息对象
      // const picInfo = { pic: file.response.url }
      // // 2.将图片信息对象push到imgurl数组中
      // this.addForm.imgurl.push(picInfo)
    },
    // 监听添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        }
        // 执行添加商品的业务逻辑
        // lodash cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数和静态属性
        this.manyTabelData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTabelData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // console.log(form)
        if (!form.imgurl.length) {
          const picInfo2 = { pic: 'https://b2.kuibu.net/file/imgdisk/imgs/2022/05/548567f17dd0a59b.png' }
          form.imgurl.push(picInfo2)
        }
        // 添加商品
        const { data: res } = await this.$http.post(
          'api/allproduct/add', form)
        // console.log(res)
        // console.log(form)
        if (!res.allproduct) {
          return this.$message.error('添加商品失败！')
        }
        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }
  },
  created() {
    // 解析token获取id
    const decoded = jwtdecode(window.sessionStorage.token)
    this.addForm.userid = decoded.id
    this.addForm.shopname = decoded.shopname
  },
  mounted() {
    this.getCatList()
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
.params{
  color: red !important;
  font-size: 50px;
  height: 70px;
}
</style>
