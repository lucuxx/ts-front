<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="属性" name="first"
        ><AttributeTable v-bind="$attrs" v-if="activeName == 'first'"
      /></el-tab-pane>
      <el-tab-pane label="事件" name="third"
        ><EventTable v-bind="$attrs" v-if="activeName == 'third'"
      /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AttributeTable from "./components/AttributeTable.vue";
import EventTable from "./components/EventTable.vue";

export default {
  name: "ModelInfo",
  components: { AttributeTable, EventTable },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>

<style lang="scss" scoped></style>
