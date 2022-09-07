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
        :disabled="mode === 'LOOK'"
      >
        <el-form-item label="事件名称" prop="eventName">
          <el-input
            v-model="form.eventName"
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
        <el-form-item label="事件级别" prop="eventLevel">
          <el-radio-group v-model="form.eventLevel">
            <el-radio
              v-for="dict in dict.type.mode_event_level"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
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
import { addModelEvent, updateModelEvent } from "@/api/equipment/model";

export default {
  name: "EventConfig",
  dicts: ["mode_event_level", "mode_data_type"],
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
        eventName: "",
        fieldName: "",
        dataType: "",
        maxLength: "",
        precisionNum: "",
        unit: "",
        eventLevel: "1",
        remark: "",
      },
      rules: {
        eventName: [
          { required: true, message: "请输入事件名称", trigger: "blur" },
        ],
        fieldName: [
          { required: true, message: "请输入字段名称", trigger: "blur" },
        ],
        dataType: [
          { required: true, message: "请选择数据类型", trigger: "change" },
        ],
        eventLevel: [
          { required: true, message: "请选择事件级别", trigger: "change" },
        ],
      },
    };
  },
  created() {
    if (this.mode !== "ADD") {
      const {
        eventName,
        fieldName,
        dataType,
        maxLength,
        precisionNum,
        unit,
        eventLevel,
        remark,
        id,
      } = this.Info;
      this.form = {
        eventName,
        fieldName,
        dataType,
        maxLength,
        precisionNum,
        unit,
        eventLevel,
        remark,
        id,
      };
    } else {
      this.form = {
        eventName: "",
        fieldName: "",
        dataType: "",
        maxLength: "",
        precisionNum: "",
        unit: "",
        eventLevel: "1",
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
          const { code, msg } = await updateModelEvent(this.form);
          if (code === 200) {
            this.$modal.msgSuccess("修改成功");
            this.handleCancel(true);
          } else {
            this.$modal.msgError(msg);
          }
        } else {
          const { code, msg } = await addModelEvent(this.form);
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
