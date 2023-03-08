<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="categoryId">
        <el-select
          v-model="queryParams.categoryId"
          clearable
          filterable
          placeholder="请选择产品分类"
        >
          <el-option
            v-for="item in categoryOptions"
            :key="item.categoryId"
            :value="item.categoryId"
            :label="item.categoryName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="status">
        <el-select
          v-model="queryParams.status"
          clearable
          placeholder="请选择状态"
        >
          <el-option
            v-for="dict in productStatusMap"
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

      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          >导出</el-button
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
      <el-table-column prop="productId" label="产品ID" min-width="60">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="产品名称"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="handleLook(row)">
            {{ row.productName }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="category.categoryName"
        label="产品分类"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        :formatter="enableStateFormatter"
      >
      </el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip>
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
          {{
            mode === "EDIT"
              ? "编辑产品"
              : mode === "LOOK"
              ? "查看产品"
              : "新建产品"
          }}
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
import ProductDetail from "./components/ProductDetail.vue";
import { listProduct, delProduct } from "@/api/product/manage";
import { listCategoryOptions } from "@/api/product/category";

const productStatusMap = [
  {
    value: "0",
    label: "正常",
  },
  { value: "1", label: "停用" },
];

export default {
  name: "Project",
  components: { ProductDetail },
  data() {
    return {
      productStatusMap,
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
        productName: "",
        status: "",
        categoryId: null,
      },
      // 表单参数
      productInfo: {},
      categoryOptions: [],
    };
  },
  created() {
    this.getList();
    this.getCategory();
  },
  methods: {
    async getCategory() {
      try {
        const { code, rows } = await listCategoryOptions();
        if (code === 200) {
          this.categoryOptions = rows;
        }
      } catch (err) {
        console.log(err);
      }
    },

    async getList() {
      try {
        this.loading = true;
        const { code, rows, total } = await listProduct(this.queryParams);
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

    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "product/export",
        {
          ...this.queryParams,
        },
        `product${new Date().getTime()}.xlsx`
      );
    },

    // 查看产品详情
    handleLook(row) {
      this.drawer = true;
      this.mode = "LOOK";
      this.productInfo = row;
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
          '是否确认删除名称为"' + row.productName + '"的数据项？',
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );

        if (res === "confirm") {
          const { code } = await delProduct(row.productId);
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
      const currentType = this.productStatusMap.filter((item) => {
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
