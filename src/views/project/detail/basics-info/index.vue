<template>
  <div>
    <div class="header">
      <span class="header__title">项目信息</span>
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
      <el-descriptions-item label="项目名称">{{
        projectInfo.projectName
      }}</el-descriptions-item>
      <el-descriptions-item label="备注">{{
        projectInfo.remark
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
          {{ mode === "EDIT" ? "编辑项目" : "新建项目" }}
        </div>
      </template>
      <div class="drawer-style__content">
        <project-detail
          v-if="drawer"
          :projectInfo="projectInfo"
          :mode="mode"
          @drawerClose="drawerClose"
        ></project-detail>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import ProjectDetail from "@/views/project/manage/components/ProjectDetail.vue";
export default {
  name: "BasicsInfo",
  components: { ProjectDetail },
  props: {
    projectInfo: {
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
