<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="设备ID" prop="deviceId">
            <el-input
              v-model="form.deviceId"
              placeholder="请输入设备ID"
              clearable
              maxlength="30"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="设备名称" prop="deviceName">
            <el-input
              v-model="form.deviceName"
              placeholder="请输入设备名称"
              clearable
              maxlength="30"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="关联产品" prop="productId">
            <el-select
              v-model="form.productId"
              placeholder="请选择产品"
              class="custom-select-width"
              clearable
            >
              <el-option
                v-for="item in ProductOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所属机构" prop="deptId">
            <treeselect
              v-model="form.deptId"
              :options="deptOptions"
              :show-count="false"
              placeholder="选择所属机构"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="设备组" prop="groupList">
            <el-select
              v-model="form.groupList"
              multiple
              class="custom-select-width"
              clearable
            >
              <el-option
                v-for="item in groupOptions"
                :value="item.value"
                :label="item.label"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :rows="3"
              v-model="form.remark"
              maxlength="200"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row type="flex" justify="end">
      <el-button
        type="primary"
        @click="submitForm"
        :loading="btnLoading"
        v-if="mode !== 'LOOK'"
        >确 定</el-button
      >
      <el-button @click="cancel">取 消</el-button>
    </el-row>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { treeselect } from "@/api/system/dept";
import { listProductOptions } from "@/api/equipment/product";
import { listGroupOptions } from "@/api/equipment/group";
import { deepClone } from "@/utils";
import {
  addInstance,
  getInstance,
  updateInstance,
} from "@/api/equipment/instance";

export default {
  name: "InstanceDetail",
  dicts: ["pro_device_type"],
  components: { Treeselect },
  props: {
    info: {
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
        deviceId: "",
        deviceName: "",
        productId: "",
        deptId: null,
        groupList: [],
        remark: "",
      },
      rules: {
        deviceId: [
          { required: true, message: "设备ID不能为空", trigger: "blur" },
        ],
        deviceName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" },
        ],
        productId: [
          { required: true, message: "关联产品不能为空", trigger: "blur" },
        ],
        deptId: [
          { required: true, message: "所属机构不能为空", trigger: "blur" },
        ],
      },
      deptOptions: [],
      ProductOptions: [],
      groupOptions: [],
    };
  },
  created() {
    this.getDeptList();
    this.getProductList();
    this.getGrouptList();
    if (this.mode !== "ADD") {
      this.getInstanceInfo(this.info);
    }
  },
  methods: {
    /** 查询机构列表 */
    async getDeptList() {
      try {
        const { code, data } = await treeselect();
        if (code === 200) {
          this.deptOptions = data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    /** 查询产品列表 */
    async getProductList() {
      try {
        const { code, data } = await listProductOptions({});
        if (code === 200) {
          this.ProductOptions = data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    /** 查询分组 */
    async getGrouptList() {
      try {
        const { code, data } = await listGroupOptions({});
        if (code === 200) {
          this.groupOptions = data;
        }
      } catch (err) {
        console.log(err);
      }
    },

    /** 修改按钮操作 */
    async getInstanceInfo(row) {
      try {
        const { code, data } = await getInstance(row.id);
        if (code === 200) {
          const {
            id,
            deviceName,
            deviceId,
            deptId,
            productId,
            groupList,
            remark,
          } = data;
          this.form = {
            id,
            deviceName,
            deviceId,
            deptId,
            productId,
            groupList,
            remark,
          };
          if (groupList) {
            this.form.groupList = groupList.split(",");
          }
        }
      } catch (err) {
        console.log(err);
      }
    },

    /** 提交按钮 */
    async submitForm() {
      try {
        this.btnLoading = true;
        const isValid = await new Promise((resolve) => {
          this.$refs.form.validate(resolve);
        });
        if (!isValid) return;

        let copyForm = deepClone(this.form);

        if (!this.form.deptId) {
          copyForm.deptId = "";
        }

        if (copyForm.groupList.length) {
          copyForm.groupList = copyForm.groupList.join(",");
        }
        if (this.form.id) {
          const { code, msg } = await updateInstance(copyForm);
          if (code === 200) {
            this.$modal.msgSuccess("修改成功");
            this.cancel(true);
          } else {
            this.$modal.msgError(msg);
          }
        } else {
          const { code, msg } = await addInstance(copyForm);
          if (code === 200) {
            this.$modal.msgSuccess("创建成功");
            this.cancel(true);
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
    cancel(val) {
      this.$emit("closeDialog", val);
    },
  },
};
</script>

<style></style>
