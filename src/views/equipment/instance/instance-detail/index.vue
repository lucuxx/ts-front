<template>
  <div class="app-container">
    <!-- <el-empty v-if="loading" descriton="加载中..."></el-empty> -->
    <IotLoading v-if="loading" />
    <template v-else>
      <el-page-header @back="handleBack">
        <template #content>
          {{ pageTitle }}
          <el-divider direction="vertical"></el-divider>
          <div
            class="status-style"
            :style="{
              background:
                status == '0'
                  ? '#f5222d'
                  : status == '1'
                  ? '#52c41a'
                  : status == '2'
                  ? '#1890ff'
                  : '',
            }"
          ></div>
          <span class="status-name"> {{ statusName }}</span>
        </template>
      </el-page-header>
      <br />
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="BasicsInfo"
          ><BasicsInfo :instanceInfo="instanceInfo"
        /></el-tab-pane>
        <el-tab-pane label="物模型" name="ModelInfo"
          ><ModelInfo :instanceInfo="instanceInfo"
        /></el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>
import BasicsInfo from "./basics-info";
import ModelInfo from "./model-info";
import { getInstance } from "@/api/equipment/instance";

export default {
  name: "ProductDetail",
  dicts: ["pro_device_type", "device_status"],
  components: { BasicsInfo, ModelInfo },
  data() {
    return {
      pageTitle: "XXXX",
      status: "",
      activeName: "BasicsInfo",
      statusName: "在线",
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
        const { code, data } = await getInstance(id);
        if (code === 200) {
          this.instanceInfo = data;
          const currentType = this.dict.type.pro_device_type.filter((item) => {
            return item.value == data.deviceType;
          });

          const currentStatus = this.dict.type.device_status.filter((item) => {
            return item.value == data.status;
          });
          this.instanceInfo.customDeviceName = currentType[0]?.label;
          this.statusName = currentStatus[0]?.label;
          this.status = data.status;
          this.pageTitle = data.deviceName;
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
  .status-style {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    margin-left: 10px;
  }
  .status-name {
    font-size: 14px;
  }
}
::v-deep .el-divider--vertical {
  margin: 0 20px;
}
</style>
