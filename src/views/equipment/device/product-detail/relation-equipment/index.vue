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
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="deviceType">
        <el-select
          v-model="queryParams.deviceType"
          placeholder="请选择设备类型"
          clearable
        >
          <el-option
            v-for="dict in dict.type.pro_device_type"
            :key="dict.value"
            :value="dict.value"
            :label="dict.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="groupId">
        <el-select
          v-model="queryParams.groupId"
          clearable
          placeholder="请选择设备组"
        >
          <el-option
            v-for="item in groupOptions"
            :value="item.value"
            :label="item.label"
            :key="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="deptId">
        <treeselect
          v-model="queryParams.deptId"
          :options="deptOptions"
          :show-count="false"
          placeholder="选择所属机构"
          style="width: 215px"
        />
      </el-form-item>
      <el-form-item label="" prop="enableState">
        <el-select
          v-model="queryParams.enableState"
          clearable
          placeholder="请选择状态"
        >
          <el-option
            v-for="dict in dict.type.product_device_state"
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
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-if="refreshTable" v-loading="loading" :data="tableList">
      <template #empty>
        <el-empty></el-empty>
      </template>
      <el-table-column prop="id" label="设备ID" min-width="120">
      </el-table-column>
      <el-table-column prop="deviceName" label="设备名称" min-width="120">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">
            {{ row.deviceName }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="所属产品"></el-table-column>
      <el-table-column
        prop="deviceType"
        label="设备类型"
        :formatter="deviceTypeFormatter"
      ></el-table-column>
      <el-table-column prop="groupNameList" label="设备组"></el-table-column>
      <el-table-column prop="deptName" label="所属机构"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <div
            class="status-style"
            :style="{
              background:
                row.status == '0'
                  ? '#52c41a'
                  : row.status == '1'
                  ? '#f5222d'
                  : row.status == '2'
                  ? '#1890ff'
                  : '',
            }"
          ></div>
          {{ row.status | statusFilter }}</template
        >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="120"
      ></el-table-column>
      <!-- <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >编辑</el-button
          >

          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>

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
import { listGroupOptions } from "@/api/equipment/group";
import { listInstance } from "@/api/equipment/instance";

const StatusMap = new Map([
  ["0", "离线"],
  ["1", "在线"],
]);

export default {
  name: "ServerTable",
  components: { Treeselect },
  dicts: ["pro_device_type", "product_device_state"],
  filters: {
    statusFilter: function (value) {
      if (value == null) return "--";
      return StatusMap.get(value);
    },
  },
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
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        productId: "",
        deviceId: "",
        deviceType: "",
        groupId: null,
        enableState: "",
        deviceName: "",
      },
      // 表单参数
      form: {},
      deptOptions: [],
      groupOptions: [],
    };
  },
  created() {
    const { params } = this.$route;
    this.queryParams.productId = params.id;
    this.getList();
    this.getDeptList();
    this.getGrouptList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { code, data } = await listInstance(this.queryParams);
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

    /** 查询分组 */
    async getGrouptList() {
      try {
        const { code, data } = await listGroupOptions({});
        if (code === 200) {
          this.groupOptions = data;
        }
      } catch (err) {
        console.log(err);
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

    deviceTypeFormatter(row) {
      if (!row.deviceType) return "--";
      const currentType = this.dict.type.pro_device_type.filter((item) => {
        return item.value == row.deviceType;
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
  .status-style {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 4px;
  }
}
</style>
