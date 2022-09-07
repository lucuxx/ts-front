<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="" prop="gatewayName">
        <el-input
          v-model="queryParams.gatewayName"
          placeholder="请输入网关名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择类型"
          clearable
        >
          <el-option
            v-for="item in dict.type.network_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
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

    <el-table v-if="refreshTable" v-loading="loading" :data="tableList">
      <template #empty>
        <el-empty></el-empty>
      </template>
      <el-table-column prop="gatewayName" label="网关名称">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="handleLook(row)">
            {{ row.gatewayName }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" :formatter="typeFormatter">
      </el-table-column>
      <el-table-column prop="networkName" label="网络组件"></el-table-column>
      <el-table-column prop="messageCodecNames" label="协议">
        <template #default="{ row }">
          {{ row.messageCodecNames.join() }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          {{ row.status == 0 ? "已停用" : "已启用" }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        width="200"
      >
        <template #default="{ row }">
          <template v-if="row.status == 0">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-video-play"
              @click="handlePublish(row, 1)"
              >启用</el-button
            >

            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(row)"
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
          <template v-else>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-video-pause"
              @click="handlePublish(row, 2)"
              >停用</el-button
            >
          </template>
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
          {{ title }}
        </div>
      </template>
      <div class="drawer-style__content">
        <GatewayDetail
          v-if="drawer"
          :info="info"
          :mode="mode"
          @drawerClose="drawerClose"
        ></GatewayDetail>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import GatewayDetail from "./components/GatewayDetail.vue";
import {
  listGateway,
  delGateway,
  enableGateway,
  disableGateway,
} from "@/api/equipment/gateway";

const statusOptions = [
  { value: 0, label: "已停用" },
  { value: 1, label: "已启用" },
];

export default {
  name: "Gateway",
  components: { GatewayDetail },
  dicts: ["network_type"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 条数
      total: 0,
      // 产品数据
      tableList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      drawer: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        gatewayName: "",
        type: "",
        status: "",
      },
      info: null,
      mode: "ADD",
      statusOptions,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { code, data } = await listGateway(this.queryParams);
        if (code === 200) {
          this.tableList = data.list;
          this.total = data.total;
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.drawer = true;
      this.title = "新增设备网关";
      this.mode = "ADD";
    },

    /** 查看按钮操作 */
    handleLook(row) {
      this.drawer = true;
      this.title = "查看设备网关";
      this.mode = "LOOK";
      this.info = row;
    },

    /** 编辑按钮操作 */
    handleUpdate(row) {
      this.drawer = true;
      this.title = "编辑设备网关";
      this.mode = "EDIT";
      this.info = row;
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

    // 发布  val 1：启用 2: 停用
    async handlePublish(row, val) {
      try {
        let name = "启用";
        if (val === 2) {
          name = "停用";
        }

        const res = await this.$confirm(
          `是否确认${name}名称为(${row.gatewayName})的数据项？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );

        if (res === "confirm") {
          if (val == 1) {
            const { code, msg } = await enableGateway(row.id);
            this.resultFun(code, msg);
          } else {
            const { code, msg } = await disableGateway(row.id);
            this.resultFun(code, msg);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },

    resultFun(code, msg) {
      if (code === 200) {
        this.getList();
        this.$modal.msgSuccess("操作成功");
      } else {
        this.$modal.msgError(msg || "网络异常，请稍后再试");
      }
    },

    /** 删除按钮操作 */
    async handleDelete(row) {
      try {
        const res = await this.$confirm(
          '是否确认删除名称为"' + row.gatewayName + '"的数据项？',
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );

        if (res === "confirm") {
          const { code } = await delGateway(row.id);
          if (code === 200) {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          }
        }
      } catch (err) {
        console.log(err);
      }
    },

    typeFormatter(row) {
      if (!row.type) return "--";
      const currentGateway = this.dict.type.network_type.filter((item) => {
        return item.value == row.type;
      });
      return currentGateway[0]?.label;
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
