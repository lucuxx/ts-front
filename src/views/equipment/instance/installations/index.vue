<template>
  <div class="app-container">
    <InstanceNum />
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
      <el-form-item label="" prop="status">
        <el-select
          v-model="queryParams.status"
          clearable
          placeholder="请选择在线状态"
        >
          <el-option
            v-for="dict in dict.type.device_status"
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

    <el-table v-if="refreshTable" v-loading="loading" :data="dataList">
      <template #empty>
        <el-empty></el-empty>
      </template>
      <el-table-column
        prop="deviceId"
        label="设备ID"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column prop="deviceName" label="设备名称">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="handleLook(row)">
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
      <el-table-column
        prop="groupNameList"
        label="设备组"
        min-width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="deptName" label="所属机构"></el-table-column>

      <el-table-column
        prop="enableState"
        label="状态"
        :formatter="enableStateFormatter"
      ></el-table-column>
      <el-table-column prop="status" label="在线状态">
        <template #default="{ row }">
          <div
            class="status-style"
            :style="{
              background:
                row.status == '0'
                  ? '#f5222d'
                  : row.status == '1'
                  ? '#52c41a'
                  : row.status == '2'
                  ? '#1890ff'
                  : '',
            }"
          ></div>
          {{ statusFormatter(row) }}</template
        >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="130"
      ></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        width="200"
      >
        <template #default="{ row }">
          <template v-if="row.enableState == '0'">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-video-play"
              @click="handleUpdateStatus(row, 1)"
              >启用</el-button
            >

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
          <template v-else>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-video-pause"
              @click="handleUpdateStatus(row, 0)"
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

    <!-- 添加或修改分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <InstanceDetail
        v-if="open"
        :info="info"
        :mode="mode"
        @closeDialog="closeDialog"
      />
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { treeselect } from "@/api/system/dept";
import {
  listInstance,
  delInstance,
  updateInstanceStatus,
} from "@/api/equipment/instance";
import InstanceDetail from "./components/InstanceDetail.vue";
import InstanceNum from "../components/InstanceNum.vue";

import { listProductOptions } from "@/api/equipment/product";
import { listGroupOptions } from "@/api/equipment/group";

export default {
  name: "Installactions",
  dicts: ["pro_device_type", "product_device_state", "device_status"],
  components: { InstanceNum, InstanceDetail, Treeselect },
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
      // 分类树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        deviceId: "",
        deviceName: "",
        enableState: "",
        status: "",
        deviceType: "",
        productId: "",
        groupId: "",
        deptId: null,
      },
      info: null,
      mode: "ADD",
      ProductOptions: [],
      deptOptions: [],
      groupOptions: [],
    };
  },
  created() {
    this.getList();
    this.getDeptList();
    this.getProductList();
    this.getGrouptList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { code, data } = await listInstance(this.queryParams);
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
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.mode = "ADD";
      this.title = "新增设备";
    },
    handleEdit(row) {
      this.open = true;
      this.title = "修改设备";
      this.mode = "EDIT";
      this.info = row;
    },
    // 查看详情
    handleLook(row) {
      this.$router.push(`/equipment/instance/installations/detail/${row.id}`);
    },

    /** 删除按钮操作 */
    async handleDelete(row) {
      try {
        const res = await this.$confirm(
          '是否确认删除名称为"' + row.deviceName + '"的数据项？',
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );

        if (res === "confirm") {
          const { code } = await delInstance(row.id);
          if (code === 200) {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          }
        }
      } catch (err) {
        console.log(err);
      }
    },

    // 启用禁用
    async handleUpdateStatus(row, val) {
      try {
        let name = "停用";
        if (val === 1) {
          name = "启用";
        }

        const res = await this.$confirm(
          `是否确认${name}名称为(${row.deviceName})的数据项？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );

        if (res === "confirm") {
          const params = {
            id: row.id,
            enableState: String(val),
          };
          const { code, msg } = await updateInstanceStatus(params);
          this.resultFun(code, msg);
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

    closeDialog(val) {
      this.open = false;
      if (val) {
        this.resetQuery();
      }
    },

    deviceTypeFormatter(row) {
      if (!row.deviceType) return "--";
      const currentType = this.dict.type.pro_device_type.filter((item) => {
        return item.value == row.deviceType;
      });
      return currentType[0]?.label;
    },

    enableStateFormatter(row) {
      if (!row.enableState) return "--";
      const currentType = this.dict.type.product_device_state.filter((item) => {
        return item.value == row.enableState;
      });
      return currentType[0]?.label;
    },

    statusFormatter(row) {
      if (!row.status) return "--";
      const currentType = this.dict.type.device_status.filter((item) => {
        return item.value == row.status;
      });
      return currentType[0]?.label;
    },
  },
};
</script>
<style lang="scss" scoped>
.status-style {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 4px;
}
</style>
