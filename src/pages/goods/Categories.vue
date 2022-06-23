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
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除
          </el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类框 -->
    <el-dialog title="添加分类" :visible.sync="addCatDialogVisible" width="50%">
      <el-form
        :model="addCatForm"
        :rules="addCatrules"
        ref="addCatRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCatForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级别分类："> </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCatDialogVisible = false"
          >确 定</el-button
        >
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
      parentCateList: [],// 父级分类的列表
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
    //获取父级分类列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if(res.meta.status!==200){
        return this.$message.error(res.meta.msg)
      }
      this. parentCateList=res.data
      console.log(res);
    },
  },
}
</script>
      
<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
}
</style>