<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入产品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="categoryId">
        <treeselect
          v-model="queryParams.categoryId"
          :options="categoryOptions"
          :normalizer="normalizer"
          :show-count="false"
          placeholder="选择产品分类"
          style="width: 215px"
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
      <el-form-item label="" prop="protocolId">
        <el-select
          v-model="queryParams.protocolId"
          placeholder="请选择消息协议"
          clearable
        >
          <el-option
            v-for="item in protocalOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="deviceType">
        <el-select
          v-model="queryParams.state"
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

    <el-table v-if="refreshTable" v-loading="loading" :data="productList">
      <template #empty>
        <el-empty></el-empty>
      </template>
      <el-table-column prop="id" label="产品ID" min-width="120">
      </el-table-column>
      <el-table-column prop="productCode" label="产品编码"></el-table-column>
      <el-table-column prop="name" label="产品名称">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="handleLook(row)">
            {{ row.name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" label="产品分类"></el-table-column>
      <el-table-column
        prop="deviceType"
        label="设备类型"
        :formatter="deviceTypeFormatter"
      >
      </el-table-column>
      <el-table-column prop="protocolName" label="消息协议">
        <template #default="{ row }">
          {{ row.protocolName ? row.protocolName : "--" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="state"
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
          <template v-if="row.state == '0'">
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
        <product-detail
          v-if="drawer"
          :productInfo="productInfo"
          :mode="mode"
          @drawerClose="drawerClose"
        ></product-detail>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import ProductDetail from "./components/ProductDetail.vue";
import {
  listProduct,
  updateProductStatus,
  delProduct,
} from "@/api/equipment/product";
import { getMessageCodecOptions } from "@/api/equipment/protocal";
import { listTreeProCategory } from "@/api/equipment/product-category";

export default {
  name: "Product",
  components: { ProductDetail, Treeselect },
  dicts: ["pro_device_type", "product_device_state", "pro_transport_protocol"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 条数
      total: 0,
      // 产品数据
      productList: [],
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
        name: "",
        deviceType: "",
        state: "",
        categoryId: null,
        protocolId: "",
      },
      // 表单参数
      productInfo: {},
      categoryOptions: [],
      protocalOptions: [],
    };
  },
  created() {
    this.getList();
    this.getCategoryList();
    this.getProtocalList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { code, data } = await listProduct(this.queryParams);
        if (code === 200) {
          this.productList = data.list;
          this.total = data.total;
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

    /** 查询分类列表 */
    async getCategoryList() {
      try {
        this.loading = true;
        const { code, data } = await listTreeProCategory({});
        if (code === 200) {
          this.categoryOptions = data;
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

    /** 查询协议列表 */
    async getProtocalList() {
      try {
        this.loading = true;
        const { code, data } = await getMessageCodecOptions({});
        if (code === 200) {
          this.protocalOptions = data;
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

    /** 转换树数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
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
      this.$router.push({
        path: `/equipment/device/product/detail/${row.id}`,
      });
    },

    // 启用禁用
    async handleUpdateStatus(row, val) {
      try {
        let name = "停用";
        if (val === 1) {
          name = "启用";
        }

        const res = await this.$confirm(
          `是否确认${name}名称为(${row.name})的数据项？`,
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
            state: String(val),
          };
          const { code, msg } = await updateProductStatus(params);
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
      this.productInfo = row;
    },

    async handleDelete(row) {
      try {
        const res = await this.$confirm(
          '是否确认删除名称为"' + row.name + '"的数据项？',
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );

        if (res === "confirm") {
          const { code } = await delProduct(row.id);
          if (code === 200) {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          }
        }
      } catch (err) {
        console.log(err);
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
      if (!row.state) return "--";
      const currentType = this.dict.type.product_device_state.filter((item) => {
        return item.value == row.state;
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
