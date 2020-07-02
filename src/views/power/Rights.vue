<template>
  <div>
    <el-breadcrumb separator-class="el-right-arrow-right">
      <el-breadcrumb-item :to="{ path : '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图 -->
    <el-card>
      <el-table :data="rightList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">{{scope.row.level}}二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1,5,10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取列表
      rightList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0
    }
  },
  created() {
    // 获取全部的权限
    this.getRightList()
  },
  methods: {
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.pagesize = newSize
      this.getRightList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.pagenum = newPage
      this.getRightList()
    },
    // 获取权限
    async getRightList() {
      const { data: res } = await this.$http.get('rights/list')

      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表数据失败')
      }

      this.total = res.data.length
      this.rightList = res.data.slice(
        (this.pagenum - 1) * this.pagesize,
        this.pagenum * this.pagesize
      )
      console.log(this.rightList)
    }
  }
}
</script>

<style scoped>
</style>
