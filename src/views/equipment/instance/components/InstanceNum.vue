<template>
  <div class="container" v-loading="loading">
    <el-row>
      <el-col :span="6">
        <p class="num color1">{{ numObj.totalNum }}</p>
        <p>设备总数</p>
      </el-col>
      <el-col :span="6">
        <p class="num color2">{{ numObj.onlineNum }}</p>
        <p>在线</p>
      </el-col>
      <el-col :span="6">
        <p class="num color3">{{ numObj.offlineNum }}</p>
        <p>离线</p>
      </el-col>
      <el-col :span="6">
        <p class="num color4">{{ numObj.deactivatedNum }}</p>
        <p>已停用</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getInstanceNum } from "@/api/equipment/instance";
export default {
  name: "InstanceNum",
  data() {
    return {
      loading: true,
      numObj: {
        totalNum: "",
        onlineNum: "",
        offlineNum: "",
        deactivatedNum: "",
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { code, data } = await getInstanceNum();
        if (code === 200) {
          console.log(data);
          const { totalNum, onlineNum, offlineNum, deactivatedNum } = data;
          this.numObj = {
            totalNum,
            onlineNum,
            offlineNum,
            deactivatedNum,
          };
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 80px;
  border-bottom: 0.5px solid #dcdfe6;
  margin-bottom: 10px;
}
p {
  margin: 5px;
  text-align: center;
  font-size: 16px;
}
.num {
  font-size: 20px;
  font-weight: bold;
  display: block;
}
.color1 {
  color: #000;
}
.color2 {
  color: #52c41a;
}
.color3 {
  color: #f5222d;
}
.color4 {
  color: #1890ff;
}
</style>
