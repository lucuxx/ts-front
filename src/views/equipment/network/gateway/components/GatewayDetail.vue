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
        <el-form-item label="网关名称" prop="gatewayName">
          <el-input
            v-model="form.gatewayName"
            :maxlength="30"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择类型"
            class="custom-select-width"
            @change="handleChangeType"
            clearable
          >
            <el-option
              v-for="item in dict.type.network_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="网络组件" prop="networkId">
          <el-select
            v-model="form.networkId"
            placeholder="请选择网络组件"
            class="custom-select-width"
            clearable
          >
            <el-option
              v-for="item in networkOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <template v-if="form.type">
          <el-form-item
            v-if="['MQTT_CLIENT', 'TCP_SERVER'].includes(form.type)"
            label="消息协议"
            prop="messageCodec"
          >
            <el-select
              v-model="form.messageCodec"
              class="custom-select-width"
              clearable
            >
              <el-option
                v-for="item in messageCodecOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="['MQTT_SERVER'].includes(form.type)"
            label="认证协议"
            prop="messageCodec"
          >
            <el-select
              v-model="form.messageCodec"
              class="custom-select-width"
              clearable
            >
              <el-option
                v-for="item in messageCodecOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="['HTTP_SERVER'].includes(form.type)"
            label="协议路由"
            prop="messageCodec"
          >
            <el-row
              v-for="(v, inV) in form.messageCodec"
              :key="v.key"
              class="row-style"
            >
              <el-col :span="10">
                <el-form-item :prop="'messageCodec.' + inV + '.name'">
                  <el-input
                    v-model="v.name"
                    placeholder="/**"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="center-style"> &gt; </el-col>
              <el-col :span="10">
                <el-form-item :prop="'messageCodec.' + inV + '.value'">
                  <el-select
                    v-model="v.value"
                    class="custom-select-width"
                    clearable
                  >
                    <el-option
                      v-for="item in messageCodecOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <template v-if="mode !== 'LOOK'">
                  <i
                    class="el-icon-delete"
                    @click="handleDelConf(inV)"
                    v-show="form.messageCodec.length > 1"
                  ></i>
                </template>
              </el-col>
            </el-row>

            <el-button
              class="custom-btn"
              icon="el-icon-plus"
              @click="handleAddConf"
              v-if="mode !== 'LOOK'"
              >添加</el-button
            >
          </el-form-item>
          <el-form-item
            label="Qos"
            prop="otherConf.Qos"
            v-if="['MQTT_CLIENT'].includes(form.type)"
          >
            <el-radio-group v-model="form.otherConf.Qos">
              <el-radio
                v-for="dict in QosOpptions"
                :key="dict.value"
                :label="dict.value"
                >{{ dict.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </template>

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
          v-if="mode !== 'LOOK'"
          >确定</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { addGateway, updateGateway, getGateway } from "@/api/equipment/gateway";
import { getMessageCodecOptions } from "@/api/equipment/protocal";
import { getTypeOptions } from "@/api/equipment/type";

import { deepClone } from "@/utils";

// MQTT客户端  MQTT_CLIENT
// MQTT服务  MQTT_SERVER
// TCP服务  TCP_SERVER
// HTTP服务  HTTP_SERVER
const QosOpptions = [
  { value: 0, label: "0" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
];

export default {
  name: "ProductDetail",
  components: {},
  dicts: ["network_type"],
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
        gatewayName: "",
        type: "",
        networkId: "",
        remark: "",
        messageCodec: null,
        otherConf: null,
      },
      rules: {
        gatewayName: [
          { required: true, message: "请输入组件名称", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        networkId: [
          { required: true, message: "请选择网络组件", trigger: "change" },
        ],
      },
      messageCodecOptions: [],
      networkOptions: [],
      QosOpptions,
    };
  },
  watch: {
    // "form.categoryId": {
    //   handler(val) {
    //     this.$refs.ruleForm.clearValidate(["categoryId"]);
    //   },
    // },
  },
  created() {
    Promise.all([this.getTypeList(), this.getProtocalList()]).then(async () => {
      if (this.mode !== "ADD") {
        const { id } = this.info;
        const { data, code } = await getGateway(id);
        if (code === 200) {
          const {
            gatewayName,
            type,
            remark,
            networkId,
            messageCodec,
            otherConf,
          } = data;
          this.form = {
            id,
            gatewayName,
            type,
            remark,
            networkId,
            messageCodec,
            otherConf,
          };
          if (type === "HTTP_SERVER") {
            const keyList = Object.keys(this.form.messageCodec);
            const newMessage = keyList.map((i) => {
              return {
                name: this.form.messageCodec[i],
                value: i,
                key: Date.now(),
              };
            });
            this.form.messageCodec = newMessage;
          } else {
            const keyList = Object.keys(messageCodec);
            this.form.messageCodec = keyList[0];
          }
        }
      } else {
        this.form = {
          gatewayName: "",
          type: "",
          remark: "",
          networkId: "",
          messageCodec: null,
          otherConf: null,
        };
      }
    });
  },
  methods: {
    handleCancel(isRefresh) {
      this.$emit("drawerClose", isRefresh);
    },

    /** 查询协议列表 */
    async getProtocalList() {
      try {
        const { code, data } = await getMessageCodecOptions({});
        if (code === 200) {
          this.messageCodecOptions = data;
        }
      } catch (err) {
        console.log(err);
      }
    },

    /** 查询网络组件列表 */
    async getTypeList() {
      try {
        const { code, data } = await getTypeOptions({});
        if (code === 200) {
          this.networkOptions = data;
        }
      } catch (err) {
        console.log(err);
      }
    },

    async handleSubmit() {
      try {
        this.btnLoading = true;
        const isValid = await new Promise((resolve) => {
          this.$refs.ruleForm.validate(resolve);
        });
        if (!isValid) return;
        const copyObj = deepClone(this.form);
        if (copyObj.type !== "HTTP_SERVER") {
          copyObj.messageCodec = {
            [copyObj.messageCodec]: "custom__value",
          };
        } else {
          const filterObj = {};
          const nameList = [];
          copyObj.messageCodec.forEach((i) => {
            filterObj[i.value] = i.name;
            if (nameList.includes(i.value)) {
              throw Error("协议不能相同");
            }
            nameList.push(i.value);
          });
          copyObj.messageCodec = filterObj;
        }

        if (this.form.id) {
          const { code, msg } = await updateGateway(copyObj);
          if (code === 200) {
            this.$modal.msgSuccess("修改成功");
            this.handleCancel(true);
          } else {
            this.$modal.msgError(msg);
          }
        } else {
          const { code, msg } = await addGateway(copyObj);
          if (code === 200) {
            this.$modal.msgSuccess("创建成功");
            this.handleCancel(true);
          } else {
            this.$modal.msgError(msg);
          }
        }
      } catch (err) {
        console.log(err);
        this.$modal.msgError(err);
      } finally {
        this.btnLoading = false;
      }
    },

    // 切换类型
    handleChangeType(val) {
      if (val) {
        this.form.type = val;
        // this.$nextTick(() => {
        if (val !== "HTTP_SERVER") {
          this.form.messageCodec = null;
          this.form.otherConf = null;
        } else {
          this.form.messageCodec = [{ name: "", value: "", key: Date.now() }];
          this.form.otherConf = null;
        }
        if (val === "MQTT_CLIENT") {
          this.form.otherConf = {
            Qos: 0,
          };
        }
        // });
      }
    },
    handleAddConf() {
      this.form.messageCodec.push({ name: "", value: "", key: Date.now() });
    },
    handleDelConf(index) {
      this.form.messageCodec.splice(index, 1);
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
.row-style {
  margin-bottom: 10px;
}
.center-style {
  text-align: center;
}
.custom-btn {
  border: 1px dashed #5482ee;
  color: #5482ee;
  margin: 10px 0;
  width: 100%;
}
.el-icon-delete {
  font-size: 16px;
  display: inline-block;
  margin-left: 6px;
  cursor: pointer;
}
</style>
