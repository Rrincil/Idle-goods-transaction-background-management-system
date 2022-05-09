<el-tab-pane label="静态属性" name="only">
<el-button
  size="mini"
  type="primary"
  :disabled="isBtnDisabled"
  @click="addDialogVisible=true"
>添加属性</el-button>
<!-- 静态属性表格 -->
<el-table :data="onlyTabelData" border stripe>
  <!-- 展开行 -->
  <el-table-column type="expand">
    <template slot-scope="scope">
      <!-- 循环渲染tag标签 -->
      <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
      <!-- 输入的文本框 -->
      <el-input
        class="input-new-tag"
        v-if="scope.row.inputVisible"
        v-model="scope.row.inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm(scope.row)"
        @blur="handleInputConfirm(scope.row)"
      ></el-input>
      <!-- 添加按鈕 -->
      <el-button
        v-else
        class="button-new-tag"
        size="small"
        @click="showInput(scope.row)"
      >+ New Tag</el-button>
    </template>
  </el-table-column>
  <el-table-column type="index"></el-table-column>
  <el-table-column label="属性名称" prop="attr_name"></el-table-column>
  <el-table-column label="操作">
    <template slot-scope="scope">
      <el-button
        type="primary"
        icon="el-icon-edit"
        size="mini"
        @click="showEditDialog(scope.row.attr_id)"
      >编辑</el-button>
      <el-button
        type="danger"
        icon="el-icon-delete"
        size="mini"
        @click="removeParams(scope.row.attr_id)"
      >删除</el-button>
    </template>
  </el-table-column>
</el-table>
</el-tab-pane>
