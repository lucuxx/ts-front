<template>
  <div>
    <el-input
      v-model="deptName"
      placeholder="请输入机构名称"
      clearable
      size="small"
      prefix-icon="el-icon-search"
      style="margin-bottom: 20px"
    />
    <br />
    <el-tree
      :data="deptOptions"
      :props="defaultProps"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      ref="tree"
      default-expand-all
      highlight-current
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script>
import { treeselect } from "@/api/system/dept";

export default {
  name: "TreeIndex",
  data() {
    return {
      deptName: "",
      deptOptions: undefined,
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  created() {
    this.getTreeselect();
  },
  methods: {
    /** 查询机构下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      console.log(data);
      this.$parent.handleNodeClick(data.id);
      // this.handleQuery();
    },
  },
};
</script>
