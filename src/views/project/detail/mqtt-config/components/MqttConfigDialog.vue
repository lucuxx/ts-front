<template>
  <div class="body">
    <div class="body-top">
      <!-- <div class="body-top__header">
        <div>基本信息</div>
        <el-divider></el-divider>
      </div> -->
      <el-form :rules="rules" ref="ruleForm" :model="form" label-width="80px">
        <el-form-item label="用户名" prop="mqUsername">
          <el-input
            v-model="form.mqUsername"
            clearable
            maxlength="30"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="mqPwd">
          <el-input
            v-model="form.mqPwd"
            type="password"
            clearable
            maxlength="64"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="body-footer">
      <div>
        <el-button @click="handleCancel(false)">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="btnLoading"
          >确定</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { addProduct, updateProduct } from "@/api/equipment/product";

export default {
  mqUsername: "MqttConfigDialog",
  props: {
    Info: {
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
        mqUsername: "",
        mqPwd: "",
      },
      rules: {
        mqUsername: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        mqPwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  created() {
    if (this.mode !== "ADD") {
      const { mqUsername, mqPwd, id } = this.Info;
      this.form = {
        mqUsername,
        mqPwd,
        id,
      };
    } else {
      this.form = {
        mqUsername: "",
        mqPwd: "",
      };
    }
  },
  methods: {
    /** 查询分类列表 */
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

        if (this.form.id) {
          const { code, msg } = await updateProduct(this.form);
          if (code === 200) {
            this.$modal.msgSuccess("修改成功");
            this.handleCancel(true);
          } else {
            this.$modal.msgError(msg);
          }
        } else {
          const { code, msg } = await addProduct(this.form);
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
</style>
