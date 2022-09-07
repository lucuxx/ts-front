<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="" prop="location">
        <el-input
          v-model="queryParams.location"
          placeholder="请输入所在区域"
          clearable
        />
      </el-form-item>
      <el-form-item label="" prop="deptId">
        <treeselect
          v-model="queryParams.deptId"
          :options="deptOptions"
          :show-count="false"
          placeholder="请选择所属机构"
          style="width: 215px"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          disabled
          >搜索</el-button
        >
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
          disabled
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
        :columns="columns"
      ></right-toolbar>
    </el-row>

    <BusinessTable
      :table-data="dataList"
      :columns="columns"
      :loading="loading"
    ></BusinessTable>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { treeselect } from "@/api/system/dept";

import BusinessTable from "@/components/BusinessTable";
import { listGroup } from "@/api/equipment/group";

import { deepClone } from "@/utils";

export default {
  name: "Monitor",
  components: { BusinessTable, Treeselect },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 条数
      total: 0,
      // 表格数据
      dataList: [],
      // 查询参数
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        location: null,
        deptId: null,
      },
      columns: [
        {
          label: "所在区域",
          prop: "location",
          visible: true,
        },
        {
          label: "所属机构",
          prop: "deptName",
          visible: true,
        },
        {
          label: "当前温度(℃)",
          prop: "deptName",
          visible: true,
        },
        {
          label: "当前湿度",
          prop: "status",
          visible: true,
        },
      ],
      deptOptions: [],
    };
  },
  created() {
    // this.getList();
    this.getDeptList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { code, data } = await listGroup(this.queryParams);
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
  },
};
</script>
