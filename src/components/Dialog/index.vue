<template>
  <el-dialog
    :title="title"
    :visible.sync="tDialogVisible"
    :width="width"
    @open="open"
    @closed="dialogClose"
    :append-to-body="appendToBody"
    :fullscreen="fullscreen"
    :top="top"
    :modal="modal"
    @before-close="beforeClose"
    :center="center"
    :close-on-click-modal="closeOnClickModel"
    @close="close"
  >
    <slot></slot>
    <span slot="footer" class="dialog-footer">
      <el-button @click="tDialogVisible = false" v-if="showCancel"
        >取 消</el-button
      >
      <el-button type="primary" @click="submit" v-if="showSubmit"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      tDialogVisible: this.dialogVisible,
    };
  },
  props: {
    dialogVisible: {
      default: false,
    },
    width: {
      default: "65%",
    },
    title: {
      default: "标题",
    },
    showCancel: {
      default: true,
    },
    showSubmit: {
      default: true,
    },
    appendToBody: {
      default: false,
    },
    fullscreen: {
      default: false,
    },
    top: {
      default: "10vh",
    },
    modal: {
      default: true,
    },
    center: {
      default: false,
    },
    closeOnClickModel: {
      default: true,
    },
  },
  watch: {
    dialogVisible: function (n) {
      this.tDialogVisible = n;
    },

    tDialogVisible(n) {
      this.$emit("update:dialogVisible", n);
    },
  },
  methods: {
    open() {
      this.$emit("open");
    },
    dialogClose() {
      this.$emit("closed");
    },
    beforeClose() {
      this.$emit("beforeClose");
    },
    close() {
      this.$emit("close");
    },
    submit() {
      this.$emit("submit");
    },
  },
};
</script>

<style lang="scss" scoped></style>
