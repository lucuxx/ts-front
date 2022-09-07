<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="" prop="key1">
        <el-input
          v-model="queryParams.key1"
          placeholder="请输入设备ID"
          clearable
        />
      </el-form-item>
      <el-form-item label="" prop="key2">
        <el-input
          v-model="queryParams.key2"
          placeholder="请输入设备名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="" prop="key3">
        <el-select
          v-model="queryParams.key3"
          clearable
          placeholder="请选择所属产品"
        >
          <el-option
            v-for="item in ProductOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="key4">
        <treeselect
          v-model="queryParams.key4"
          :options="deptOptions"
          :show-count="false"
          placeholder="请选择所属机构"
          style="width: 215px"
        />
      </el-form-item>
      <el-form-item label="" prop="key5">
        <el-input
          v-model="queryParams.key5"
          placeholder="请输入所在区域"
          clearable
        />
      </el-form-item>
      <el-form-item label="" prop="key6">
        <el-input
          v-model="queryParams.key6"
          placeholder="请输入告警内容"
          clearable
        />
      </el-form-item>
      <el-form-item label="" prop="key7">
        <el-select
          v-model="queryParams.key7"
          clearable
          placeholder="请选择告警等级"
        >
          <el-option
            v-for="item in eventLevelMap"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="key8">
        <el-date-picker
          v-model="queryParams.key8"
          type="datetime"
          clearable
          placeholder="选择启始时间"
        >
        </el-date-picker>
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
import { listProductOptions } from "@/api/equipment/product";

import BusinessTable from "@/components/BusinessTable";
import { listGroup } from "@/api/equipment/group";

import { eventLevelMap } from "@/enums"


import { deepClone } from "@/utils";

export default {
  name: "Group",
  components: { BusinessTable, Treeselect },
  data() {
    return {
      eventLevelMap,
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
        key1: null,
        key2: null,
        key3: null,
        key4: null,
        key5: null,
        key6: null,
        key7: null,
        key8: null,
      },
      columns: [
        {
          label: "设备ID",
          prop: "groupName",
          visible: true,
        },
        {
          label: "设备名称",
          prop: "deptName",
          visible: true,
        },
        {
          label: "所属产品",
          prop: "deptName",
          visible: true,
        },
        {
          label: "所属机构",
          prop: "deptName",
          visible: true,
        },
        {
          label: "所属区域",
          prop: "deptName",
          visible: true,
        },
        {
          label: "告警内容",
          prop: "deptName",
          visible: true,
        },
        {
          label: "告警等级",
          prop: "deptName",
          visible: true,
        },
        {
          label: "告警时间",
          prop: "createTime",
          visible: true,
        },
      ],
      ProductOptions: [],
      deptOptions: [],
    };
  },
  created() {
    // this.getList();
    this.getDeptList();
    this.getProductList();
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
    /** 查询产品列表 */
    async getProductList() {
      try {
        const { code, data } = await listProductOptions({});
        if (code === 200) {
          this.ProductOptions = data;
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
