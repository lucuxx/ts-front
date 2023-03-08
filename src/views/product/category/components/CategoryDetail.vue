<template>
  <div class="body">
    <div class="body-top">
      <el-form
        :rules="rules"
        ref="ruleForm"
        :model="form"
        label-width="80px"
        :disabled="mode == 'LOOK'"
      >
        <!-- <el-form-item label="图标">
          <el-upload
            class="avatar-uploader"
            :action="upload.url"
            :headers="upload.headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="分类ID">
          <el-input v-model="form.categoryId" disabled></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryName">
          <el-input
            v-model="form.categoryName"
            :maxlength="30"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            v-model="form.remark"
            :maxlength="200"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="body-footer">
      <div>
        <el-button @click="handleCancel(false)">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="btnLoading"
          :disabled="mode == 'LOOK'"
          >确定</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { addCategory, updateCategory } from "@/api/product/category";

export default {
  name: "CategoryDetail",
  components: {},
  props: {
    categoryInfo: {
      type: Object,
      default: () => {},
    },
    mode: {
      type: String,
      default: "ADD",
    },
  },
  data() {
    return {
      btnLoading: false,
      form: {
        categoryId: "",
        categoryName: "",
        remark: "",
      },
      rules: {
        categoryName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
    };
  },

  created() {
    if (this.mode !== "ADD") {
      const { categoryId, categoryName, remark } = this.categoryInfo;
      this.form = {
        categoryId,
        categoryName,
        remark,
      };
    } else {
      this.form = {
        categoryId: "",
        categoryName: "",
        remark: "",
      };
    }
  },
  methods: {
    handleCancel(isRefresh) {
      this.$emit("drawerClose", isRefresh);
    },
    async handleSubmit() {
      try {
        this.btnLoading = true;
        const isValid = await new Promise((resolve) => {
          this.$refs.ruleForm.validate(resolve);
        });
        if (!isValid) return;
        if (this.form.categoryId) {
          const { code, msg } = await updateCategory(this.form);
          if (code === 200) {
            this.$modal.msgSuccess("修改成功");
            this.handleCancel(true);
          } else {
            this.$modal.msgError(msg);
          }
        } else {
          const { code, msg } = await addCategory(this.form);
          if (code === 200) {
            this.$modal.msgSuccess("创建成功");
            this.handleCancel(true);
          } else {
            this.$modal.msgError(msg);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.btnLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;
  &-top {
    flex: 1;
    padding: 20px;
    overflow-y: auto;

    &__header {
      line-height: 10px;
      font-size: 14px;
      font-weight: 600;
      color: #606266;
    }
  }
  &-footer {
    border-top: 1px solid #dcdfe6;
    height: 60px;
    display: flex;
    justify-content: flex-end;
    align-content: center;
    line-height: 60px;
    padding-right: 20px;
  }
}

::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
::v-deep .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
::v-deep .avatar {
  width: 100px;
  height: 100px;
  display: block;
}

// ::v-deep .el-radio__label {
//   font-size: 14px;
//   padding-left: 10px;
//   margin-top: 8px;
//   display: inline-block;
// }
// ::v-deep .el-radio {
//   // margin-right: 100px;
//   width: 200px;
// }
</style>
