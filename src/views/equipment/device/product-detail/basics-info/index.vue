<template>
  <div>
    <div class="header">
      <span class="header__title">产品信息</span>
      <el-button
        type="primary"
        plain
        icon="el-icon-edit"
        size="mini"
        @click="handleEdit"
        >编辑</el-button
      >
    </div>
    <el-descriptions :column="1">
      <el-descriptions-item label="产品名称">{{
        productInfo.name
      }}</el-descriptions-item>
      <el-descriptions-item label="产品分类">{{
        productInfo.categoryName
      }}</el-descriptions-item>
      <el-descriptions-item label="协议">{{
        productInfo.transportProtocol
      }}</el-descriptions-item>
      <el-descriptions-item label="设备类型">{{
        productInfo.deviceName
      }}</el-descriptions-item>
      <el-descriptions-item label="厂商">{{
        productInfo.manufacturer
      }}</el-descriptions-item>
      <el-descriptions-item label="型号">{{
        productInfo.mode
      }}</el-descriptions-item>
      <el-descriptions-item label="备注">{{
        productInfo.remark
      }}</el-descriptions-item>
    </el-descriptions>

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
import ProductDetail from "../../product/components/ProductDetail.vue";
export default {
  name: "BasicsInfo",
  components: { ProductDetail },
  props: {
    productInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      mode: "EDIT",
      drawer: false,
    };
  },
  methods: {
    handleEdit() {
      this.drawer = true;
    },
    // 关闭弹框
    handleClose() {
      this.drawer = false;
    },

    drawerClose(val) {
      this.handleClose();
      if (val) {
        const { fullPath } = this.$route;

        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath,
          });
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 20px;
  &__title {
    padding-right: 20px;
  }
}
::v-deep
  .el-descriptions--medium:not(.is-bordered)
  .el-descriptions-item__cell {
  padding-bottom: 20px;
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
