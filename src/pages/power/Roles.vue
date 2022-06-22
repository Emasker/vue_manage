<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row
        ><el-col
          ><el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          ></el-col
        ></el-row
      >
      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['rowmg', 'vcenter', 'bdbottom', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级列表 -->
              <el-col :span="5" align="center">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  align="middle"
                >
                  <el-col :span="6" align="center">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRightById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="286">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >编辑
            </el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRolesById(scope.row.id)"
              >删除
            </el-button>
            <!-- 分配权限按钮 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetDialog(scope.row)"
              >分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色提示框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="ruleFormRules"
        ref="addFormRef"
        label-width="90px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色提示框 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="ruleFormRules"
        ref="editFormRef"
        label-width="90px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setDialogVisible"
      width="50%"
      @close="setDialogClosed"
    >
      <el-input placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>
      <el-tree
        class="filter-tree"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        ref="treeRef"
        :data="rightsList"
        show-checkbox
        node-key="id"
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
      
<script>
export default {
  name: 'Roles',
  data() {
    return {
      //角色列表
      rolesList: [],
      addDialogVisible: false, //添加框显示
      //添加角色数据
      addForm: {},
      //表单验证规则
      ruleFormRules: {
        roleName: [
          { required: true, message: '角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { message: '角色描述', trigger: 'blur' },
          {
            min: 0,
            max: 20,
            message: '至多 20 个字描述',
            trigger: 'blur',
          },
        ],
      },
      editDialogVisible: false, //修改的显示
      //查询的角色信息
      editForm: {},
      setDialogVisible: false, //权限对话框
      rightsList: [], //权限列表
      //树状图配置
      defaultProps: {
        children: 'children',
        label: 'authName',
      },
      filterText: '', //搜索关键字
      defKeys: [], //默认勾选数组
      roleId: {}, //正在更改权限的id
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      } else {
        this.rolesList = res.data
      }
    },
    //关闭添加表单清空数据
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //确认添加
    addRoles() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('表单不完善')
        } else {
          //添加角色
          const { data: res } = await this.$http.post('roles', this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.error('添加角色失败')
          } else {
            this.$message.success('添加角色成功')
            this.addDialogVisible = false
            this.getRolesList()
          }
        }
      })
    },
    //编辑角色信息
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('调取角色信息失败')
      }

      this.editForm = res.data
      this.editDialogVisible = true
    },
    //关闭修改表单清空数据
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //修改后提交
    editRolesInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('表单不完善')
        } else {
          //发起修改信息请求
          const { data: res } = await this.$http.put(
            'roles/' + this.editForm.roleId,
            {
              roleName: this.editForm.roleName,
              roleDesc: this.editForm.roleDesc,
            }
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          } else {
            this.$message.success('信息修改成功')
            this.editDialogVisible = false
            this.getRolesList()
          }
        }
      })
    },
    //删除角色
    async removeRolesById(id) {
      await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('roles/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败')
          } else {
            this.$message.success('删除成功!')
            this.getRolesList()
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    //根据id删除角色权限
    async removeRightById(role, rightId) {
      await this.$confirm('此操作将永久取消该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          )
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          } else {
            this.$message.success(res.meta.msg)
            role.children = res.data
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '操作已取消',
          })
        })
    },
    //分配权限对话框
    async showSetDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.rightsList = res.data
      }
      this.getLeafKeys(role, this.defKeys)
      this.setDialogVisible = true
    },
    //树状图搜索
    filterNode(value, data) {
      if (!value) return true
      return data.authName.indexOf(value) !== -1
    },
    //递归获取角色已有的三级权限
    getLeafKeys(node, arr) {
      //如果当前节点没有chilren属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    //关闭对话框后清空已有节点
    setDialogClosed() {
      this.defKeys = []
    },
    //点击确定后保存树中勾选的节点
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.$message.success(res.meta.msg)
        this.getRolesList()
      }
      this.setDialogVisible = false
    },
  },
  watch: {
    //监听搜索匡
    filterText(val) {
      this.$refs.treeRef.filter(val)
    },
  },
}
</script>
      
<style lang="less" scoped>
.el-col {
  .el-tag {
    margin: 7px;
  }
}
.rowmg {
  margin: 0 50px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>