<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"> </el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table border stripe :data="orderlist">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '1'" type="success"
              >已付款</el-tag
            >
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_send === '是'" type="success"
              >已发货</el-tag
            >
            <el-tag v-else type="danger">未发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改地址"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="showBox(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="物流进度"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                size="mini"
                icon="el-icon-location"
                @click="showProgress"
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
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :props="{
              expandTrigger: 'hover',
            }"
            clearable
            :options="cityData"
            v-model="editForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddress"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.ftime"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
      
<script>
import cityData from './citydata'
import progress from './kuaidi'
export default {
  name: 'Order',
  data() {
    return {
      //分页器参数
      queryInfo: {
        query: ' ', //搜索框
        pagenum: 1, //当前页数
        pagesize: 5, //显示条数
      },
      total: 0, //总数据条数
      orderlist: [], //订单数据
      editVisible: false, //编辑对话框
      //地址数据
      editForm: {
        address1: [],
        address2: '',
      },
      //编辑表单验证
      editFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' },
        ],
      },
      cityData, //城市数据
      progressVisible: false, //物流显示
      progressInfo: [], //物流数据
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.orderlist = res.data.goods
        this.total = res.data.total
      }
    },
    // 分页器
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    //修改地址
    showBox(row) {
        console.log(row);
      this.editVisible = true
    },
    // 修改表单关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //提交修改
    editAddress(){
        this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('表单不完善')
        } 
        this.$message.success("地址修改成功")
        this.editVisible=false
      })

    },
    //查看物流进度
    showProgress() {
      const res = progress[0]
      this.progressInfo = res.data
      if (res.meta.status !== 200) {
        this.$message.error('获取物流信息错误')
      } else {
        this.$message.success(res.meta.message)
        this.progressVisible = true
      }
    },
  },
}
</script>
      
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>