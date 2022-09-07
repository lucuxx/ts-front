<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入姓名"
          clearable
        />
      </el-form-item>
      <el-form-item label="" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入手机号"
          clearable
        />
      </el-form-item>
      <el-form-item label="" prop="label">
        <el-input
          v-model="queryParams.label"
          placeholder="请输入人员类型"
          clearable
        />
      </el-form-item>
      <el-form-item label="" prop="key4">
        <el-input
          v-model="queryParams.key4"
          placeholder="请输入所属企业"
          clearable
        />
      </el-form-item>
      <el-form-item label="" prop="deviceId">
        <el-input
          v-model="queryParams.deviceId"
          placeholder="请输入设备名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="" prop="dateValue">
        <el-date-picker
          v-model="dateValue"
          type="datetimerange"
          clearable
          range-separator="-"
          start-placeholder="通行开始时间"
          end-placeholder="通行结束时间"
          @change="handleChangeDate"
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
      <el-col :span="1.5">
        <el-button type="primary" plain size="mini" @click="handleExport"
          >导出</el-button
        >
      </el-col>

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
import BusinessTable from "@/components/BusinessTable";
import { listSuccessListPage, exportRecordData } from "@/api/access/record";
import { downloadFile } from "@/utils/file";
import { deepClone } from "@/utils";

export default {
  name: "Group",
  components: { BusinessTable },
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
      // 查询参数
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        userName: null,
        mobile: null,
        label: null,
        key4: null,
        deviceId: null,
        startTime: null,
        endTime: null,
      },
      dateValue: [],
      columns: [
        {
          label: "姓名",
          prop: "userName",
          visible: true,
        },
        {
          label: "手机号",
          prop: "mobile",
          visible: true,
        },
        {
          label: "登记照片",
          prop: "faceImageUrl",
          visible: true,
        },
        {
          label: "抓拍照片",
          prop: "sceneImageUrl",
          visible: true,
        },
        {
          label: "人员类型",
          prop: "labels",
          visible: true,
        },
        {
          label: "通行时间",
          prop: "recognizeTime",
          visible: true,
        },
        {
          label: "所属企业",
          prop: "parkOrgName",
          visible: true,
        },
        {
          label: "设备名称",
          prop: "deviceName",
          visible: true,
        },
        {
          label: "设备位置",
          prop: "deviceLocation",
          visible: true,
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { code, data } = await listSuccessListPage(this.queryParams);
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

    async handleExport() {
      const copyObj = deepClone(this.queryParams);
      delete copyObj.pageNum;
      delete copyObj.pageSize;
      await exportRecordData(copyObj).then((res) => {
        downloadFile(res.file, "通行记录.xlsx");
      });
    },

    handleChangeDate() {
      if (this.dateValue.length) {
        this.queryForm.startTime = this.dateValue[0];
        this.queryForm.endTime = this.dateValue[1];
      } else {
        this.queryForm.startTime = "";
        this.queryForm.endTime = "";
      }
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.dateValue = [];
      this.queryForm.startTime = "";
      this.queryForm.endTime = "";
      this.handleQuery();
    },
  },
};
</script>
