<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCatDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 树状表 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级
          </el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="option" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row.cat_id)"
            >编辑
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[5, 7, 10, 15]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCatForm"
        :rules="addCatrules"
        ref="addCatRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCatForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader
            v-model="selectedOptions"
            :options="parentCateList"
            @change="CateChange"
            :props="{
              expandTrigger: 'hover',
              checkStrictly: true,
              ...cascaderProps,
            }"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisbel"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editCate"
        :rules="editCateRules"
        ref="editCateRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCate.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisbel = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
      
<script>
export default {
  name: 'Categories',
  data() {
    return {
      //分页器参数
      queryInfo: {
        type: 3, //1，2，3 分别表示显示一层二层三层分类列表
        pagenum: 1, //当前页数
        pagesize: 5, //显示条数
      },
      total: 0, //总数据条数
      //商品分类的数据列表
      cateList: [],
      //树状表列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template', // 表示，将当前列定义为模板列
          template: 'isOk', // 表示当前这一列使用模板名称
        },
        {
          label: '列表排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'option',
        },
      ],
      addCatDialogVisible: false, //添加对话框的显示
      //添加功能的表单数据集
      addCatForm: {
        cat_name: '', //分类名称
        cat_pid: 0, //分类父 ID
        cat_level: 0, //分类层级
      },
      //添加的表单验证规则
      addCatrules: {
        cat_name: [
          { required: true, message: '请输入类别名称', trigger: 'blur' },
        ],
      },
      parentCateList: [], // 父级分类的列表
      //级联选择器配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //选中的父级分类id
      selectedOptions: [],
      editCateDialogVisbel: false, //编辑对话框的显示
      editCate: {}, //编辑的数据
      editCateRules: {
        cat_name: [
          { required: true, message: '请输入要修改的信息', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品分类表单
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    //点击添加按钮
    showAddCatDialog() {
      this.addCatDialogVisible = true
      this.getParentCateList()
    },
    //监听pagesize改边
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    //监听pagenum改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    //获取父级分类列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.parentCateList = res.data
    },
    //监听选择项改变
    CateChange() {
      if (this.selectedOptions.length > 0) {
        this.addCatForm.cat_pid =
          this.selectedOptions[this.selectedOptions.length - 1]
        this.addCatForm.cat_level = this.selectedOptions.length
        return
      } else {
        this.addCatForm.cat_pid = 0
        this.addCatForm.cat_level = 0
      }
    },
    // 点击按钮添加新的分类
    async addCate() {
      this.$refs.addCatRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCatForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getCateList()
        this.addCatDialogVisible = false
      })
    },
    //添加对话框关闭
    addCateDialogClosed() {
      this.$refs.addCatRef.resetFields()
      this.selectedOptions = []
      this.addCatForm.cat_pid = 0
      this.addCatForm.cat_level = 0
    },
    //点击编辑按钮
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editCate = res.data
      this.editCateDialogVisbel = true
    },
    //提交编辑信息
    editCateInfo() {
      this.$refs.editCateRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('表单不完善')
        } else {
          const { data: res } = await this.$http.put(
            'categories/' + this.editCate.cat_id,
            { cat_name: this.editCate.cat_name }
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          } else {
            this.$message.success(res.meta.msg)
            this.editCateDialogVisbel = false
            this.getCateList()
          }
        }
      })
    },
    //关闭修改表单清空数据
    editDialogClosed() {
      this.editCateId = 0
      this.editCate = {}
    },
    //删除分类
    async removeCate(id) {
      await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('categories/' + id)

          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          } else {
            this.$message.success(res.meta.msg)
            this.getCateList()
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
  },
}
</script>
      
<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>