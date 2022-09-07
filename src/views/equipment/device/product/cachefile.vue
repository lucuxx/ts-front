<template>
  <div class="container">
    <div class="header">
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch"
      >
        <el-form-item label="产品名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入产品名称"
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
            v-hasPermi="['system:menu:add']"
            >新增</el-button
          >
        </el-col>

        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>
    </div>

    <!-- 内容区 -->
    <div class="content">
      <el-row justify="center" :gutter="20">
        <el-col
          :xs="24"
          :sm="12"
          :md="12"
          :lg="8"
          :xl="6"
          v-for="item in productList"
          :key="item.id"
        >
          <el-card shadow="hover">
            <div class="card-wrap__top">
              <div class="card-wrap__topleft">
                <img
                  v-if="item.photoUrl"
                  class="card-wrap__topimg"
                  :src="item.photoUrl"
                />
                <div v-else class="card-wrap__topimg"></div>
              </div>
              <div class="card-wrap__topright">
                <div class="card-wrap__topName">{{ item.name }}</div>
                <br />
                <div class="card-wrap__topId">{{ item.id }}</div>
              </div>
            </div>
            <div class="card-wrap__middle">
              <div class="card-wrap__middleItem">
                <div class="card-wrap__itemKey">设备数量</div>
                <div class="card-wrap__itemValue number-style">0</div>
              </div>
              <div class="card-wrap__middleItem">
                <div class="card-wrap__itemKey">发布状态</div>
                <div class="card-wrap__itemValue">
                  <div
                    class="state-style"
                    :style="{
                      background: item.state == 1 ? '#52c41a' : '#f5f7f9',
                    }"
                  ></div>
                  {{ item.state == 1 ? "已发布" : "未发布" }}
                </div>
              </div>
              <div class="card-wrap__middleItem">
                <div class="card-wrap__itemKey">产品类型</div>
                <div class="card-wrap__itemValue">
                  {{ item.categoryName ? item.categoryName : "--" }}
                </div>
              </div>
            </div>
            <div class="card-wrap__footer">
              <el-tooltip
                class="item"
                effect="dark"
                content="查看"
                placement="top"
              >
                <div class="card-wrap__footerItem">
                  <svg-icon class-name="eye-open" icon-class="eye-open" />
                </div>
              </el-tooltip>
              <el-divider direction="vertical"></el-divider>
              <el-tooltip
                class="item"
                effect="dark"
                content="编辑"
                placement="top"
              >
                <div class="card-wrap__footerItem" @click="handleEdit(item)">
                  <svg-icon class-name="edit" icon-class="edit" />
                </div>
              </el-tooltip>
              <el-divider direction="vertical"></el-divider>
              <el-tooltip
                class="item"
                effect="dark"
                content="下载"
                placement="top"
              >
                <div class="card-wrap__footerItem">
                  <i class="el-icon-download"></i>
                </div>
              </el-tooltip>
              <el-divider direction="vertical"></el-divider>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top"
              >
                <div class="card-wrap__footerItem" @click="handleDelete(item)">
                  <i class="el-icon-delete"></i>

                  <!-- <el-dropdown>
                  <span class="el-dropdown-link">
                    <i class="el-icon-more"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item divided @click.native="handleStop(item)"
                      ><span>停用</span></el-dropdown-item
                    >
                    <el-dropdown-item divided @click.native="handleDelete(item)">
                      <span>删除</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
                </div>
              </el-tooltip>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

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
import ProductDetail from "./components/ProductDetail.vue";
import { listProduct } from "@/api/equipment/product";
export default {
  components: { ProductDetail },
  name: "Product",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 产品表格树数据
      productList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      drawer: false,
      // 弹框模式
      mode: "ADD",
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        name: undefined,
      },
      // 表单参数
      form: {},
      productInfo: {},
    };
  },
  created() {
    this.getList();
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

    // 表单重置
    reset() {
      this.form = {
        menuId: undefined,
      };
      this.resetForm("form");
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
    // handleStop(row){

    // },
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
  },
};
</script>
<style lang="scss" scoped>
.container {
  // padding: 14px;
}
.header {
  padding: 14px;
  background: #fff;
  margin-bottom: 20px;
}
.content {
  background: #f5f7f9;
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
::v-deep .el-card {
  margin-bottom: 20px;
}
::v-deep .el-card__body {
  padding: 0;
}
.card-wrap__top {
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-wrap__topleft {
  width: 100px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card-wrap__topimg {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #e6ebf5;
  border: 1px solid #e6ebf5;
}
.card-wrap__topName {
  font-size: 16px;
  font-weight: 600px;
}
.card-wrap__topId {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}
.card-wrap__topright {
  padding: 14px;
  flex: 1;
  height: 100%;
}
.card-wrap__middle {
  width: 100%;
  height: 90px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.card-wrap__middleItem {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  .number-style {
    color: #5482ee;
  }
  .state-style {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 5px;
  }
}
.card-wrap__itemKey {
  font-size: 14px;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 6px;
}

.card-wrap__itemValue {
  font-size: 14px;
  line-height: 16px;
  font-weight: 600;
}
.card-wrap__footer {
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-top: 1px solid #e6ebf5;
}
.card-wrap__footerItem {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.el-divider--vertical {
  margin: 0;
}
</style>
