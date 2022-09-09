<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="deptId">
        <treeselect
          v-model="queryParams.deptId"
          :options="deptOptions"
          :show-count="false"
          placeholder="选择所属机构"
          style="width: 232px"
        />
      </el-form-item>
      <el-form-item label="" prop="status">
        <el-select
          v-model="queryParams.status"
          clearable
          placeholder="请选择状态"
        >
          <el-option
            v-for="dict in projectStatusMap"
            :key="dict.value"
            :value="dict.value"
            :label="dict.label"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>

      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-if="refreshTable" v-loading="loading" :data="datalist">
      <template #empty>
        <el-empty></el-empty>
      </template>
      <el-table-column prop="projectId" label="项目ID" min-width="120">
      </el-table-column>
      <el-table-column prop="projectName" label="项目名称">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="handleLook(row)">
            {{ row.projectName }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        :formatter="enableStateFormatter"
      >
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        width="200"
      >
        <template #default="{ row }">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 侧边栏 -->
    <el-drawer
      size="40%"
      :visible.sync="drawer"
      :before-close="handleClose"
      destroy-on-close
      custom-class="drawer-style"
    >
      <template #title>
        <div class="drawer-style__header">
          {{ mode === "EDIT" ? "编辑产品" : "新建产品" }}
        </div>
      </template>
      <div class="drawer-style__content">
        <project-detail
          v-if="drawer"
          :projectInfo="projectInfo"
          :mode="mode"
          @drawerClose="drawerClose"
        ></project-detail>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { treeselect } from "@/api/system/dept";
import ProjectDetail from "./components/ProjectDetail.vue";
import { listProject, delProject } from "@/api/project/manage";

const projectStatusMap = [
  {
    value: "0",
    label: "正常",
  },
  { value: "1", label: "停用" },
];

export default {
  name: "Project",
  components: { ProjectDetail, Treeselect },
  data() {
    return {
      projectStatusMap,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 条数
      total: 0,
      // 产品数据
      datalist: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      drawer: false,
      // 弹框模式
      mode: "ADD",
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        projectName: "",
        status: "",
        deptId: null,
      },
      // 表单参数
      projectInfo: {},
      deptOptions: [],
    };
  },
  created() {
    this.getList();
    this.getDeptList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { code, rows, total } = await listProject(this.queryParams);
        if (code === 200) {
          this.datalist = rows;
          this.total = total;
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

    /** 查询机构列表 */
    async getDeptList() {
      try {
        const { code, data } = await treeselect();
        if (code === 200) {
          this.deptOptions = data;
        }
      } catch (err) {
        console.log(err);
      }
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.pageNum = 1;
      this.handleQuery();
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.drawer = true;
      this.mode = "ADD";
    },

    // 查看产品详情
    handleLook(row) {
      this.$router.push({
        path: `/project/detail/${row.projectId}`,
      });
    },

    // 关闭弹框
    handleClose() {
      this.drawer = false;
    },

    drawerClose(val) {
      this.handleClose();
      if (val) {
        this.getList();
      }
    },

    handleEdit(row) {
      this.drawer = true;
      this.mode = "EDIT";
      this.projectInfo = row;
    },

    async handleDelete(row) {
      try {
        const res = await this.$confirm(
          '是否确认删除名称为"' + row.projectName + '"的数据项？',
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );

        if (res === "confirm") {
          const { code } = await delProject(row.projectId);
          if (code === 200) {
            this.resetQuery();
            this.$modal.msgSuccess("删除成功");
          }
        }
      } catch (err) {
        console.log(err);
      }
    },

    enableStateFormatter(row) {
      if (!row.status) return "--";
      const currentType = this.projectStatusMap.filter((item) => {
        return item.value == row.status;
      });
      return currentType[0]?.label;
    },
  },
};
</script>
<style lang="scss" scoped>
.drawer-style {
  &__header {
    line-height: 60px;
    padding-left: 15px;
    font-size: 14px;
    font-weight: 600;
    color: #606266;
  }
  &__content {
    height: calc(100vh - 60px);
    width: 100%;
    border-top: 1px solid rgba(0, 21, 41, 0.15);
  }
}

::v-deep .el-drawer__header {
  margin-bottom: 0;
  padding-bottom: 0;
  margin: 0;
  padding: 0;
}
::v-deep .el-drawer__body {
  padding: 0;
}
</style>
