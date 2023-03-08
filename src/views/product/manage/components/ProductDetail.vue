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
        <el-form-item label="产品ID">
          <el-input v-model="form.productId" disabled></el-input>
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input
            v-model="form.productName"
            :maxlength="30"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="产品分类" prop="categoryId">
          <el-select
            v-model="form.categoryId"
            filterable
            clearable
            class="custom-select-width"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.categoryId"
              :label="item.categoryName"
              :value="item.categoryId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in productStatusMap"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
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
import { addProduct, updateProduct } from "@/api/product/manage";
import { listCategoryOptions } from "@/api/product/category";

const productStatusMap = [
  {
    value: "0",
    label: "正常",
  },
  { value: "1", label: "停用" },
];

export default {
  name: "ProductDetail",
  components: {},
  props: {
    productInfo: {
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
      productStatusMap,
      btnLoading: false,
      form: {
        productId: "",
        productName: "",
        status: "0",
        categoryId: "",
        remark: "",
      },
      rules: {
        productName: [
          { required: true, message: "请输入产品名称", trigger: "blur" },
        ],
        categoryId: [
          { required: true, message: "请选择产品分类", trigger: "change" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },

      categoryOptions: [],
    };
  },

  created() {
    this.getCategory();
    if (this.mode !== "ADD") {
      const { productId, productName, categoryId, status, remark } =
        this.productInfo;
      this.form = {
        productId,
        productName,
        categoryId,
        status,
        remark,
      };
    } else {
      this.form = {
        productId: "",
        productName: "",
        categoryId: "",
        status: "0",
        remark: "",
      };
    }
  },
  methods: {
    async getCategory() {
      try {
        const { code, rows } = await listCategoryOptions();
        if (code === 200) {
          this.categoryOptions = rows;
        }
      } catch (err) {
        console.log(err);
      }
    },

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
        if (this.form.productId) {
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
