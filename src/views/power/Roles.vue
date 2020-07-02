<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/roles' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="adddialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleList" borde stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightByid(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 通过 for 循环嵌套渲染二级权限 -->
                <el-row
                  :class="[index2 === 0 ? '' : 'bdtop','vcenter']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightByid(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRightByid(scope.row, item3.id)"
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showEditForm(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="mini" @click="removeRoleInfo(scope.row.id)">删除</el-button>
            <el-button type="warning" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加角色的对话框 -->
      <el-dialog @close="addFormClosed" title="添加角色" :visible.sync="adddialogVisible" width="50%">
        <el-form :model="addForm" ref="addFormref" :rules="addFormRules" label-width="70px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="adddialogVisible = false">取消</el-button>
          <el-button @click="addFormInfo" type="primary">确定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑角色的对话框 -->
      <el-dialog @click="editFormClosed" title="修改角色" :visible.sync="editdialogVisible" width="50%">
        <el-form :model="editForm" ref="editFormRef" :rules="editFoormRules" label-width="70px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editdialogVisible = false">取消</el-button>
          <el-button @click="editFormInfo" type="primary">确定</el-button>
        </span>
      </el-dialog>

      <!-- 展示分配权限的对话框 -->
      <el-dialog
        @close="setRightDialogClosed"
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%"
      >
        <!-- 树形控件 -->
        <el-tree
          ref="treeref"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defkeys"
          :data="rightsList"
          :props="treeProps"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="allotRights">确定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有的角色列表数据
      roleList: [],
      addForm: { roleName: '', roleDesc: '' },
      editForm: {},
      editdialogVisible: false,
      adddialogVisible: false,
      setRightDialogVisible: false,
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      editFoormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defkeys: [],
      // 即将分配权限角色的id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有的角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
      console.log(this.roleList)
    },
    addFormInfo() {
      console.log(this.$refs)
      this.$refs.addFormref.validate(async valid => {
        if (!valid) {
          return false
        }

        const { data: res } = await this.$http.post('roles', {
          roleName: this.addForm.roleName,
          roleDesc: this.addForm.roleDesc
        })
        if (res.meta.status !== 201) {
          return this.$message.error('创建角色失败')
        }
        this.adddialogVisible = false
        this.getRolesList()
        this.$message.success('创建角色成功')
      })
    },
    addFormClosed() {
      this.$refs.addFormref.resetFields()
    },
    async showEditForm(id) {
      this.editdialogVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败！')
      }
      this.editForm = res.data
    },
    editFormInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑角色信息失败')
        }
        this.getRolesList()
        this.editdialogVisible = false
        this.$message.success('编辑角色信息成功')
      })
    },
    editFormClosed() {
      this.$refs.editFormRef.resetFields()
    },

    // 删除对应的角色信息
    async removeRoleInfo(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色信息失败')
      }
      this.getRolesList()
      this.$message.success('删除角色信息成功')
    },
    async removeRightByid(role, rightId) {
      // 弹框提示是否要删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }

      role.children = res.data
    },
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message('获取权限数据失败')
      }

      this.rightsList = res.data
      this.getLeafKeys(role, this.defkeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的Id,并保存到defkeys中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    setRightDialogClosed() {
      this.defkeys = []
    },
    // 点击位角色分配权限
    async allotRights() {
      console.log(this.$refs.treeref)
      const keys = [
        ...this.$refs.treeref.getCheckedKeys(),
        ...this.$refs.treeref.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: idStr
      })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }

      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eeeeee;
}

.bdbottom {
  border-bottom: 1px solid #eeeeee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
