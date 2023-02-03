<template>
  <div class="app-container">
    <!-- <el-empty v-if="loading" descriton="加载中..."></el-empty> -->
    <IotLoading v-if="loading" />
    <template v-else>
      <el-page-header @back="handleBack" :content="pageTitle"></el-page-header>
      <br />
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="项目信息" name="BasicsInfo"
          ><BasicsInfo :projectInfo="projectInfo"
        /></el-tab-pane>
        <el-tab-pane label="成员信息" name="UserInfo">
          <UserInfo :projectInfo="projectInfo" />
        </el-tab-pane>
        <!-- <el-tab-pane label="物模型" name="ModelInfo"><ModelInfo /></el-tab-pane>
        <el-tab-pane label="关联设备" name="RelationEquipment"
          ><RelationEquipment
        /></el-tab-pane> -->
      </el-tabs>
    </template>
  </div>
</template>

<script>
import BasicsInfo from "./basics-info";
import UserInfo from "./user-info";
import MqttConfig from "./mqtt-config";
import ModelInfo from "./model-info";
import RelationEquipment from "./relation-equipment";
import { getProject } from "@/api/project/manage";

export default {
  name: "ProjectDetail",
  components: {
    BasicsInfo,
    UserInfo,
    //  MqttConfig, ModelInfo, RelationEquipment
  },
  data() {
    return {
      pageTitle: "XXXX",
      activeName: "BasicsInfo",
      loading: true,
    };
  },
  created() {
    const { params } = this.$route;
    if (!params.id) return;
    this.getList(params.id);
  },
  methods: {
    async getList(id) {
      try {
        this.loading = true;
        const { code, data } = await getProject(id);
        if (code === 200) {
          this.projectInfo = data;
          this.pageTitle = data.projectName;
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
    handleBack() {
      this.$router.go(-1);
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  min-height: 200px;
}
</style>
