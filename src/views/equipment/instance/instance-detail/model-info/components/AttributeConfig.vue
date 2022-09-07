<template>
  <div class="body">
    <div class="body-top">
      <!-- <div class="body-top__header">
        <div>基本信息</div>
        <el-divider></el-divider>
      </div> -->
      <el-form
        :rules="rules"
        ref="ruleForm"
        :model="form"
        label-width="80px"
        :disabled="mode == 'LOOK'"
      >
        <el-form-item label="属性名称" prop="propertyName">
          <el-input
            v-model="form.propertyName"
            :maxlength="30"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="字段名" prop="fieldName">
          <el-input
            v-model="form.fieldName"
            :maxlength="30"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="数据类型" prop="dataType">
          <el-select
            v-model="form.dataType"
            placeholder="请选择数据类型"
            class="custom-select-width"
            @change="handleChangeDataType"
            clearable
          >
            <el-option
              v-for="item in dict.type.mode_data_type"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 数据类型判断 -->
        <template v-if="form.dataType">
          <el-form-item
            v-show="['3', '4'].includes(form.dataType)"
            label="精度"
            prop="precisionNum"
          >
            <el-input-number
              style="width: 100%"
              v-model="form.precisionNum"
              controls-position="right"
              placeholder="请输入小数点位数"
              :min="1"
              :max="10"
            ></el-input-number>
          </el-form-item>
          <el-form-item
            v-show="['1', '2', '3', '4'].includes(form.dataType)"
            label="单位"
            prop="unit"
          >
            <el-input
              v-model="form.unit"
              :maxlength="30"
              placeholder="请输入单位"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            v-show="['5'].includes(form.dataType)"
            label="最大长度"
            prop="maxLength"
            placeholder="请输入最大长度"
          >
            <el-input-number
              style="width: 100%"
              v-model="form.maxLength"
              controls-position="right"
              placeholder="请输入最大长度"
              :min="1"
              :max="10"
            ></el-input-number>
          </el-form-item>
        </template>
        <el-form-item label="是否只读" prop="readOnly">
          <el-radio-group v-model="form.readOnly">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数据来源" prop="dataSource">
          <el-select
            v-model="form.dataSource"
            placeholder="请选择数据来源"
            class="custom-select-width"
            clearable
          >
            <el-option
              v-for="item in dict.type.mode_data_source"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            type="textarea"
            :maxlength="200"
            v-model="form.remark"
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
          v-if="mode !== 'LOOK'"
          >确定</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { addModelProperty, updateModelProperty } from "@/api/equipment/model";

export default {
  name: "AttributeConfig",
  dicts: ["mode_data_source", "mode_data_type"],
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
        productId: "",
        propertyName: "",
        fieldName: "",
        dataType: "",
        maxLength: "",
        precisionNum: "",
        unit: "",
        readOnly: "1",
        dataSource: "",
        remark: "",
      },
      rules: {
        propertyName: [
          { required: true, message: "请输入属性名称", trigger: "blur" },
        ],
        fieldName: [
          { required: true, message: "请输入字段名称", trigger: "blur" },
        ],
        dataType: [
          { required: true, message: "请选择数据类型", trigger: "change" },
        ],
        readOnly: [
          { required: true, message: "请选择是否只读", trigger: "change" },
        ],
        dataSource: [
          { required: true, message: "请选择数据来源", trigger: "change" },
        ],
      },
    };
  },
  created() {
    if (this.mode !== "ADD") {
      const {
        propertyName,
        fieldName,
        dataType,
        maxLength,
        precisionNum,
        unit,
        readOnly,
        dataSource,
        remark,
        id,
      } = this.Info;
      this.form = {
        propertyName,
        fieldName,
        dataType,
        maxLength,
        precisionNum,
        unit,
        readOnly,
        dataSource,
        remark,
        id,
      };
    } else {
      this.form = {
        propertyName: "",
        fieldName: "",
        dataType: "",
        maxLength: "",
        precisionNum: "",
        unit: "",
        readOnly: "1",
        dataSource: "",
        remark: "",
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

        const { params } = this.$route;
        this.form.productId = params.id;

        if (this.form.id) {
          const { code, msg } = await updateModelProperty(this.form);
          if (code === 200) {
            this.$modal.msgSuccess("修改成功");
            this.handleCancel(true);
          } else {
            this.$modal.msgError(msg);
          }
        } else {
          const { code, msg } = await addModelProperty(this.form);
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
    // 更改数据类型
    handleChangeDataType(val) {
      if (["1", "2", "3", "4"].includes(val)) {
        this.form.maxLength = "";
      } else if (["1", "2"].includes(val)) {
        this.form.precisionNum = "";
      } else if (["6"].includes(val)) {
        this.form.maxLength = "";
        this.form.precisionNum = "";
        this.form.unit = "";
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
