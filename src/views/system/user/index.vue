<template>
  <div class="app-container container">
    <div class="container-content">
      <div v-show="treemenu" class="side">
        <TreeIndex ref="treemenuRef" @click="handleNodeClick"></TreeIndex>
        <!-- @click="handleNodeClick"
        @add="add"
        @del="handleDelete"
        @positionAdd="positionAdd"
        @positionEdit="positionEdit"
        @positionDelete="positionDelete" -->
      </div>

      <div
        @click="treemenu = !treemenu"
        style="cursor: pointer; position: absolute; top: 45%; z-index: 99"
        :style="`left:${treemenu ? '240px' : '-14px'}`"
      >
        <div class="img-wrap">
          <div class="img-top"></div>
          <div class="img-center">
            <i class="el-icon-caret-left" v-if="treemenu" title="关闭菜单"></i
            ><i v-else class="el-icon-caret-right" title="打开菜单"></i>
          </div>
          <div class="img-bottom"></div>
        </div>
      </div>

      <div class="main">
        <TablePage ref="tablePageRef" @loadTree="loadTree"></TablePage>
      </div>
    </div>
  </div>
</template>

<script>
import TreeIndex from "./components/TreeIndex.vue";
import TablePage from "./components/TablePage.vue";

export default {
  name: "User",
  components: {
    TreeIndex,
    TablePage,
  },
  data() {
    return {
      treemenu: true,
    };
  },
  methods: {
    handleNodeClick(data) {
      this.$refs.tablePageRef.queryParams.deptId = data;
      this.$refs.tablePageRef.handleQuery();
    },

    // 刷新左侧组织树
    loadTree() {
      this.$refs.treemenuRef.getTreeList();
      this.utilReload();
    },
    utilReload() {
      this.dictTypeCode = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: calc(100vh - 124px);
  width: 100%;
  background: #fff;
  // border: 1px solid #dfe6ec;
  &-content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: relative;
  }
  .img-class {
    height: 80px;
  }
  .side {
    width: 240px;
    height: 100%;
    padding: 10px;
    border-right: 1px solid #dfe6ec;
  }
  .main {
    flex: 1;
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 0px 20px 10px 20px;
    .empty-container {
      margin-top: calc(25vh);
    }
  }
}
.img-wrap {
  width: 18px;
  .img-top {
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-left: 8px solid #5488ee;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #5488ee;
    box-sizing: border-box;
  }
  .img-center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 38px;
    width: 16px;
    background: #5488ee;
    box-sizing: border-box;
    .el-icon-caret-left {
      font-size: 24px;
      color: #fff;
    }
    .el-icon-caret-right {
      font-size: 24px;
      color: #fff;
    }
  }
  .img-bottom {
    width: 0;
    height: 0;
    border-top: 8px solid #5488ee;
    border-left: 8px solid #5488ee;
    border-right: 8px solid transparent;
    border-bottom: 8px solid transparent;
    box-sizing: border-box;
  }
}
</style>
