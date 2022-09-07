<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="" prop="deviceId">
        <el-input
          v-model="queryParams.deviceId"
          placeholder="请输入设备ID"
          clearable
        />
      </el-form-item>
      <el-form-item label="" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="" prop="productId">
        <el-select
          v-model="queryParams.productId"
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
      <el-form-item label="" prop="deptId">
        <treeselect
          v-model="queryParams.deptId"
          :options="deptOptions"
          :show-count="false"
          placeholder="请选择所属机构"
          style="width: 215px"
        />
      </el-form-item>
      <el-form-item label="" prop="location">
        <el-input
          v-model="queryParams.location"
          placeholder="请输入所在区域"
          clearable
        />
      </el-form-item>
      <el-form-item label="" prop="eventLevel">
        <el-select
          v-model="queryParams.eventLevel"
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

      <el-form-item label="" prop="startTime">
        <el-date-picker
          v-model="queryParams.startTime"
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
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
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
import { listJtDeviceWarningPage } from "@/api/energy/alarm";

import { deepClone } from "@/utils";
import { eventLevelMap } from "@/enums";

export default {
  name: "Alarm",
  components: { BusinessTable, Treeselect },
  data() {
    return {
      eventLevelMap,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 条数
      total: 0,
      // 表格数据
      dataList: [],
      // 查询参数
      queryParams: {
        productCodes: ["P0000005", "P0000006", "P0000007"],
        pageSize: 10,
        pageNum: 1,
        deviceId: null,
        deviceName: null,
        productId: null,
        deptId: null,
        location: null,
        eventLevel: null,
        startTime: null,
      },
      columns: [
        {
          label: "设备ID",
          prop: "deviceId",
          visible: true,
        },
        {
          label: "设备名称",
          prop: "deviceName",
          visible: true,
        },

        {
          label: "所属产品",
          prop: "productName",
          visible: true,
        },
        {
          label: "所属机构",
          prop: "deptName",
          visible: true,
        },
        {
          label: "所在区域",
          prop: "location",
          visible: true,
        },
        {
          label: "告警内容",
          prop: "eventName",
          visible: true,
        },
        {
          label: "告警等级",
          prop: "eventLevel",
          visible: true,
        },
        {
          label: "告警时间",
          prop: "eventTime",
          visible: true,
        },
      ],
      ProductOptions: [],
      deptOptions: [],
    };
  },
  created() {
    this.getList();
    this.getDeptList();
    this.getProductList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { code, data } = await listJtDeviceWarningPage(this.queryParams);
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
