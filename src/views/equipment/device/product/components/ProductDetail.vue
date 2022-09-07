<template>
  <div class="body">
    <div class="body-top">
      <div class="body-top__header">
        <div>基本信息</div>
        <el-divider></el-divider>
      </div>
      <el-form :rules="rules" ref="ruleForm" :model="form" label-width="80px">
        <el-form-item label="图标">
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
        </el-form-item>
        <el-form-item label="产品ID">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="产品编码" prop="productCode">
          <el-input v-model="form.productCode" maxlength="10" :disabled="mode !== 'ADD'"></el-input>
        </el-form-item>
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="form.name" :maxlength="30" clearable></el-input>
        </el-form-item>
        <el-form-item label="产品分类" prop="categoryId">
          <treeselect
            v-model="form.categoryId"
            :options="categoryOptions"
            :normalizer="normalizer"
            :show-count="false"
            placeholder="选择产品分类"
          />
        </el-form-item>
        <!-- <el-form-item label="所属机构" prop="deptId">
          <treeselect
            v-model="form.deptId"
            :options="deptOptions"
            :show-count="false"
            placeholder="选择所属机构"
          />
        </el-form-item> -->
        <el-form-item label="设备类型" prop="deviceType">
          <el-radio-group v-model="form.deviceType" @change="handleChangeType">
            <el-radio
              v-for="dict in dict.type.pro_device_type"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="消息协议"
          prop="protocolId"
          v-if="form.deviceType !== '4'"
        >
          <el-select
            v-model="form.protocolId"
            placeholder="请选择消息协议"
            class="custom-select-width"
            clearable
          >
            <el-option
              v-for="item in protocalOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="传输协议" prop="transportProtocol">
          <el-select
            v-model="form.transportProtocol"
            placeholder="请选择传输协议"
            class="custom-select-width"
            clearable
          >
            <el-option
              v-for="item in dict.type.pro_transport_protocol"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="厂商" prop="manufacturer">
          <el-input v-model="form.manufacturer" :maxlength="30" clearable />
        </el-form-item>
        <el-form-item label="型号" prop="mode">
          <el-input v-model="form.mode" :maxlength="30" clearable />
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
        <el-button type="primary" @click="handleSubmit" :loading="btnLoading"
          >确定</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  listTreeProCategory,
  getProductCategory,
} from "@/api/equipment/product-category";
import { addProduct, updateProduct } from "@/api/equipment/product";
import { getMessageCodecOptions } from "@/api/equipment/protocal";
import request from "@/utils/request";
import { getToken } from "@/utils/auth";

export default {
  name: "ProductDetail",
  components: { Treeselect },
  dicts: ["pro_device_type", "pro_transport_protocol"],
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
      btnLoading: false,
      form: {
        photoUrl: "",
        id: "",
        name: "",
        categoryName: "",
        categoryId: null,
        protocolId: "",
        transportProtocol: "",
        deviceType: "1",
        manufacturer: "",
        mode: "",
        remark: "",
        productCode:""

      },
      rules: {
        name: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
        categoryId: [
          { required: true, message: "请选择所属品类", trigger: "change" },
        ],
        // deptId: [
        //   { required: true, message: "请选择所属机构", trigger: "change" },
        // ],
        productCode: [
          { required: true, message: "请输入产品编码", trigger: "blur" },
        ],
        protocolId: [
          { required: true, message: "请选择消息协议", trigger: "change" },
        ],
        transportProtocol: [
          { required: true, message: "请选择传输协议", trigger: "change" },
        ],
        deviceType: [
          { required: true, message: "请选择设备类型", trigger: "change" },
        ],
      },
      categoryOptions: [],
      protocalOptions: [],
      // deptOptions: [],
      upload: {
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: `${request.baseURL}/file/file/upload`,
      },
      imageUrl: "",
    };
  },
  watch: {
    "form.categoryId": {
      handler(val) {
        this.$refs.ruleForm.clearValidate(["categoryId"]);
      },
    },
  },
  created() {
    Promise.all([this.getCategoryList(), this.getProtocalList()]).then(
      async () => {
        if (this.mode !== "ADD") {
          const {
            photoUrl,
            id,
            name,
            categoryName,
            categoryId,
            protocolId,
            transportProtocol,
            deviceType,
            manufacturer,
            mode,
            remark,
            productCode
          } = this.productInfo;
          this.form = {
            photoUrl,
            id,
            name,
            categoryName,
            categoryId,
            protocolId,
            transportProtocol,
            deviceType,
            manufacturer,
            mode,
            remark,
            productCode
          };
          this.imageUrl = photoUrl;
        } else {
          this.form = {
            photoUrl: "",
            id: "",
            name: "",
            categoryName: "",
            categoryId: null,
            protocolId: "",
            transportProtocol: "",
            deviceType: "1",
            manufacturer: "",
            mode: "",
            remark: "",
            productCode:""
          };
          this.imageUrl = "";
        }
      }
    );
  },
  methods: {
    /** 查询分类列表 */
    async getCategoryList() {
      try {
        this.loading = true;
        const { code, data } = await listTreeProCategory({});
        if (code === 200) {
          this.categoryOptions = data;
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

    /** 查询协议列表 */
    async getProtocalList() {
      try {
        this.loading = true;
        const { code, data } = await getMessageCodecOptions({});
        if (code === 200) {
          this.protocalOptions = data;
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

    /** 转换树数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
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
        await this.getCategoryName(this.form.categoryId);
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
    async getCategoryName(id) {
      try {
        if (!id) return;
        const { code, data } = await getProductCategory(id);
        if (code === 200) {
          this.form.categoryName = data.name;
        }
      } catch (err) {
        console.log(err);
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(res, "res");
      if (res.code === 200) {
        this.form.photoUrl = res.data.url;
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = ["image/jpeg", "image/jpg", "image/png"].includes(
        file.type
      );
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG,PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleChangeType(val) {
      if (val === "4") {
        this.form.protocolId = "";
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
::v-deep .el-radio__label {
  font-size: 14px;
  padding-left: 10px;
  margin-top: 8px;
  display: inline-block;
}
::v-deep .el-radio {
  // margin-right: 100px;
  width: 200px;
}
</style>
