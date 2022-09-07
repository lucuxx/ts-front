<template>
  <div>
    <div class="header">
      <span class="header__title">设备信息</span>
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
      <el-descriptions-item label="设备ID">{{
        instanceInfo.deviceId
      }}</el-descriptions-item>
      <el-descriptions-item label="设备名称">{{
        instanceInfo.deviceName
      }}</el-descriptions-item>
      <el-descriptions-item label="设备组">{{
        instanceInfo.groupNameList
      }}</el-descriptions-item>
      <el-descriptions-item label="关联产品">
        {{ instanceInfo.productName }}

        <el-link type="primary" :underline="false" @click="handleLook"
          ><span class="link-style">查看</span></el-link
        >
      </el-descriptions-item>
      <el-descriptions-item label="设备类型">{{
        instanceInfo.customDeviceName
      }}</el-descriptions-item>
      <el-descriptions-item label="所属机构">{{
        instanceInfo.deptName
      }}</el-descriptions-item>
      <el-descriptions-item label="备注">{{
        instanceInfo.remark
      }}</el-descriptions-item>
    </el-descriptions>

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
import InstanceDetail from "../../installations/components/InstanceDetail.vue";

export default {
  name: "BasicsInfo",
  components: { InstanceDetail },
  props: {
    instanceInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      mode: "EDIT",
      open: false,
      title: "修改设备",
      info: null,
      mode: "ADD",
    };
  },
  methods: {
    handleEdit() {
      this.open = true;
      this.title = "修改设备";
      this.mode = "EDIT";
      this.info = this.instanceInfo;
    },

    handleLook() {
      this.$router.push({
        path: `/equipment/device/product/detail/${this.instanceInfo.productId}`,
      });
    },
    // 关闭弹框
    handleClose() {
      this.open = false;
    },

    closeDialog(val) {
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
.link-style {
  display: inline-block;
  padding: 0 20px;
}
</style>
