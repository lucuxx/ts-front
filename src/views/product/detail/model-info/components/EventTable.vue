<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="" prop="eventName">
        <el-input
          v-model="queryParams.eventName"
          placeholder="请输入事件名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="fieldName">
        <el-input
          v-model="queryParams.fieldName"
          placeholder="请输入字段名"
          clearable
          @keyup.enter.native="handleQuery"
        />
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

    <el-table v-if="refreshTable" v-loading="loading" :data="dataList">
      <template #empty>
        <el-empty></el-empty>
      </template>
      <el-table-column prop="eventName" label="事件名称">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="handleLook(row)">
            {{ row.eventName }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="fieldName" label="字段名"></el-table-column>
      <el-table-column
        prop="dataType"
        label="数据类型"
        :formatter="dataTypeFormatter"
      ></el-table-column>
      <el-table-column
        prop="eventLevel"
        label="事件级别"
        :formatter="eventLevelFormatter"
      ></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
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

    <!-- 添加或修改分类对话框 -->
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
          {{
            mode === "EDIT"
              ? "编辑事件"
              : mode === "LOOK"
              ? "查看事件"
              : "添加事件"
          }}
        </div>
      </template>
      <div class="drawer-style__content">
        <EventConfig
          v-if="drawer"
          :Info="info"
          :mode="mode"
          @drawerClose="drawerClose"
        />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import EventConfig from "./EventConfig.vue";

import { listModelEvent, delModelEvent } from "@/api/equipment/model";

export default {
  name: "AttributeTable",
  dicts: ["mode_event_level", "mode_data_type"],
  components: { EventConfig },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 条数
      total: 0,
      // 表格数据
      dataList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      drawer: false,
      // 弹框模式
      mode: "ADD",
      // 是否展开，默认全部折叠
      // isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        eventName: "",
        fieldName: "",
      },
      // 表单参数
      info: {},
    };
  },
  created() {
    const { params } = this.$route;
    this.queryParams.productId = params.id;
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { code, data } = await listModelEvent(this.queryParams);
        if (code === 200) {
          this.dataList = data.list;
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
      this.mode = "ADD";
    },

    // 查看产品详情
    handleLook(row) {
      this.drawer = true;
      this.info = row;
      this.mode = "LOOK";
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
      this.info = row;
    },

    async handleDelete(row) {
      try {
        const res = await this.$confirm(
          '是否确认删除名称为"' + row.eventName + '"的数据项？',
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );

        if (res === "confirm") {
          const { code } = await delModelEvent(row.id);
          if (code === 200) {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          }
        }
      } catch (err) {
        console.log(err);
      }
    },

    dataTypeFormatter(row) {
      if (!row.dataType) return "--";
      const currentType = this.dict.type.mode_data_type.filter((item) => {
        return item.value == row.dataType;
      });
      return currentType[0]?.label;
    },

    eventLevelFormatter(row) {
      if (!row.eventLevel) return "--";
      const currentType = this.dict.type.mode_event_level.filter((item) => {
        return item.value == row.eventLevel;
      });
      return currentType[0]?.label;
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  padding: 0;
  border: none;
  box-shadow: unset;
}

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
