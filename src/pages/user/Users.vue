<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索和添加 -->
      <el-row :gutter="20">
        <el-col :span="10"
          ><el-input
            placeholder="请输入用户名"
            v-model.trim="queryInfo.query"
            clearable
            @clear="getUserList"
            ><el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户表格 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index" label="#" width="48"> </el-table-column>
        <el-table-column prop="username" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="mg_state" label="状态" width="180">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="role_name" label="身份" width="180">
        </el-table-column>
        <el-table-column label="操作" width="174">
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
                @click="showEditDialog(scope.row.id)"
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
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配身份"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户提示框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="ruleFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户提示框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="ruleFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
      
<script>
export default {
  name: 'Users',
  data() {
    return {
      //展示列表参数
      queryInfo: {
        query: '', //查询参数
        pagenum: 1, //当前页数
        pagesize: 5, //显示条数
      },
      userList: [], //用户数据
      total: 0, //数据总数
      addDialogVisible: false, //添加用户对话框显示
      //添加用户数据
      addForm: {},
      //表单验证规则
      ruleFormRules: {
        username: [
          { required: true, message: '用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '密码', trigger: 'blur' },
          {
            pattern: /^[0-9a-zA-Z]{6,20}$/,
            message: '长度在 6 到 20 个的中英文',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '邮箱', trigger: 'blur' },
          {
            pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
            message: '请输入正确格式的邮箱',
            trigger: 'blur',
          },
        ],
        mobile: [
          { required: true, message: '手机号', trigger: 'blur' },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '请输入正确格式的手机号',
            trigger: 'blur',
          },
        ],
      },
      editDialogVisible: false, //修改表单的显示
      //查询的用户信息
      editForm: {},
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    //获取管理员列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取管理员列表失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    //监听显示页数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    //监听页码值
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    //监听开关状态值
    async userStateChange(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        this.$message.error('更新状态失败')
        userinfo.mg_state = !userinfo.mg_state
      } else {
        this.$message.success('更新状态成功')
      }
    },
    //关闭添加表单清空数据
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //确认添加
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('表单填写错误')
        } else {
          //添加用户
          const { data: res } = await this.$http.post('users', this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.error('添加用户失败')
          } else {
            this.$message.success('添加用户成功')
            this.addDialogVisible = false
            this.getUserList()
          }
        }
      })
    },
    //编辑用户信息
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('调取用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //关闭修改表单清空数据
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //修改后提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('表单填写错误')
        } else {
          //发起修改信息请求
          const { data: res } = await this.$http.put(
            'users/' + this.editForm.id,
            { email: this.editForm.email, mobile: this.editForm.mobile }
          )
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('信息修改失败')
          } else {
            this.$message.success('信息修改成功')
            this.editDialogVisible = false
            this.getUserList()
          }
        }
      })
    },
    //删除用户
    async removeUserById(id) {
      await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败')
          } else {
            this.$message.success('删除成功!')
            this.getUserList()
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
</style>