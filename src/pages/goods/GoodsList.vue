<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="102"
        ></el-table-column>
        <el-table-column
          prop="goods_number"
          label="商品重量"
          width="80"
        ></el-table-column>
        <el-table-column prop="add_time" label="上架时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <!-- 修改按钮 -->
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.goods_id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeGoodById(scope.row.goods_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 编辑 -->
    <el-dialog
      title="修改商品"
      :visible.sync="editDialogVisbel"
      width="50%"
      @close="editDialogClosed"
    >
      <el-alert
        title="此处接口错误，功能失效"
        type="error"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-form
        :model="editGood"
        :rules="editGoodRules"
        ref="editGoodRef"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGood.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editGood.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editGood.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editGood.goods_number" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisbel = false">取 消</el-button>
        <el-button type="primary" @click="editGoodInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
      
<script>
export default {
  name: 'GoodsList',
  data() {
    return {
      // 请求参数
      queryInfo: {
        query: '', //查询参数
        pagenum: 1, //当前页码
        pagesize: 10, //每页显示条数
      },
      goodslist: [], //商品列表
      total: 0, //数据总数
      editDialogVisbel: false,
      editGoodDialogVisbel: false, //编辑对话框的显示
      editGood: {}, //编辑的数据
      editGoodRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          {
            pattern: /^\d+(\.(?!.*0$)\d{1,2})?$/,
            message: '商品价格不能小于零,且小数点后两位即可',
            trigger: 'blur',
          },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
          {
            pattern: /^\d+(\.(?!.*0$)\d{1,2})?$/,
            message: '商品重量不能小于零，且最多保留小数后两位',
            trigger: 'blur',
          },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          {
            pattern: /^[1-9]\d*$/,
            message: '商品数量应为正整数',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //获取商品理表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        this.goodslist = res.data.goods
        this.total = res.data.total
      }
    },
    // 分页器
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    //编辑商品
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editGood = res.data
      this.editDialogVisbel = true
    },
    //关闭修改表单清空数据
    editDialogClosed() {
      this.editGood = {}
    },
    //提交编辑信息
    editGoodInfo() {
      this.$refs.editGoodRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('表单不完善')
        } else {
          const { data: res } = await this.$http.put(
            'goods/' + this.editGood.goods_id,
            {
              goods_name: this.editGood.goods_name,
              goods_price: this.editGood.goods_price,
              goods_number: this.editGood.goods_number,
              goods_weight: this.editGood.goods_weight,
            }
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          } else {
            this.$message.success(res.meta.msg)
            this.editGoodDialogVisbel = false
            this.getGoodsList()
          }
        }
      })
    },
    //删除商品
    async removeGoodById(id) {
      await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('goods/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          } else {
            this.$message.success(res.meta.msg)
            this.getGoodsList()
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    goAddPage() {
      this.$router.push('/goods/add')
    },
  },
}
</script>
      
<style lang="less" scoped>
</style>