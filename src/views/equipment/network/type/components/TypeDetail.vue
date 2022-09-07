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
        <el-form-item label="组件名称" prop="networkName">
          <el-input
            v-model="form.networkName"
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
        <el-form-item label="集群" prop="clusterConf">
          <el-radio-group
            v-model="form.clusterConf"
            @change="handleChangeCluster"
          >
            <el-radio
              v-for="dict in clusterConfOptions"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>

        <!-- 单选配置 -->
        <template v-if="form.networkConfig.length && form.clusterConf == 0">
          <div v-for="(item, index) in form.networkConfig" :key="item.key">
            <div v-if="form.type === 'MQTT_CLIENT'">
              <el-form-item
                label="客户端ID"
                :prop="'networkConfig.' + index + '.otherConf.clientId'"
                :rules="[
                  { required: true, message: '请填写', trigger: 'blur' },
                ]"
              >
                <el-input
                  v-model="item.otherConf.clientId"
                  maxlength="30"
                  clearable
                ></el-input>
              </el-form-item>

              <el-form-item
                label="HOST"
                :prop="'networkConfig.' + index + '.host'"
                :rules="[
                  { required: true, message: '请填写', trigger: 'blur' },
                ]"
              >
                <el-input v-model="item.host" maxlength="200"></el-input>
              </el-form-item>
              <el-form-item
                label="端口号"
                :prop="'networkConfig.' + index + '.port'"
                :rules="[
                  { required: true, message: '请填写', trigger: 'blur' },
                ]"
              >
                <el-input-number
                  v-model="item.port"
                  controls-position="right"
                  :min="0"
                  :max="65535"
                  class="custom-select-width"
                />
              </el-form-item>
              <el-form-item
                label="TLS"
                :prop="'networkConfig.' + index + '.secureLayer'"
                :rules="[
                  { required: true, message: '请选择', trigger: 'change' },
                ]"
              >
                <el-radio-group v-model="item.secureLayer">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="证书"
                :prop="'networkConfig.' + index + '.certificateId'"
                :rules="[
                  { required: true, message: '请选择', trigger: 'change' },
                ]"
              >
                <el-select
                  v-model="item.certificateId"
                  class="custom-select-width"
                  clearable
                >
                  <el-option
                    v-for="i in certificateOptions"
                    :key="i.value"
                    :value="i.value"
                    :label="i.label"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="用户名"
                :prop="'networkConfig.' + index + '.otherConf.userName'"
                :rules="[
                  { required: true, message: '请填写', trigger: 'blur' },
                ]"
              >
                <el-input
                  v-model="item.otherConf.userName"
                  maxlength="30"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item
                label="密码"
                :prop="'networkConfig.' + index + '.otherConf.password'"
                :rules="[
                  { required: true, message: '请填写', trigger: 'blur' },
                ]"
              >
                <el-input
                  v-model="item.otherConf.password"
                  maxlength="64"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item
                label="最大消息长度"
                :prop="'networkConfig.' + index + '.otherConf.maxFramLength'"
                :rules="[
                  { required: true, message: '请填写', trigger: 'blur' },
                ]"
              >
                <el-input-number
                  v-model="item.otherConf.maxFramLength"
                  controls-position="right"
                  :min="1"
                  :max="8096"
                  class="custom-select-width"
                />
              </el-form-item>
            </div>
            <div v-if="form.type === 'MQTT_SERVER'">
              <el-form-item
                label="线程数"
                :prop="'networkConfig.' + index + '.otherConf.threadNum'"
                :rules="[
                  { required: true, message: '请填写', trigger: 'blur' },
                ]"
              >
                <el-input-number
                  v-model="item.otherConf.threadNum"
                  controls-position="right"
                  :min="1"
                  :max="10"
                  class="custom-select-width"
                />
              </el-form-item>

              <el-form-item
                label="HOST"
                :prop="'networkConfig.' + index + '.host'"
                :rules="[
                  { required: true, message: '请填写', trigger: 'blur' },
                ]"
              >
                <el-input v-model="item.host" maxlength="200"></el-input>
              </el-form-item>
              <el-form-item
                label="端口号"
                :prop="'networkConfig.' + index + '.port'"
                :rules="[
                  { required: true, message: '请填写', trigger: 'blur' },
                ]"
              >
                <el-input-number
                  v-model="item.port"
                  controls-position="right"
                  :min="0"
                  :max="65535"
                  class="custom-select-width"
                />
              </el-form-item>
              <el-form-item
                label="TLS"
                :prop="'networkConfig.' + index + '.secureLayer'"
                :rules="[
                  { required: true, message: '请选择', trigger: 'change' },
                ]"
              >
                <el-radio-group v-model="item.secureLayer">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="证书"
                :prop="'networkConfig.' + index + '.certificateId'"
                :rules="[
                  { required: true, message: '请选择', trigger: 'change' },
                ]"
              >
                <el-select
                  v-model="item.certificateId"
                  class="custom-select-width"
                  clearable
                >
                  <el-option
                    v-for="i in certificateOptions"
                    :key="i.value"
                    :value="i.value"
                    :label="i.label"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="最大消息长度"
                :prop="'networkConfig.' + index + '.otherConf.maxFramLength'"
                :rules="[
                  { required: true, message: '请填写', trigger: 'blur' },
                ]"
              >
                <el-input-number
                  v-model="item.otherConf.maxFramLength"
                  controls-position="right"
                  :min="1"
                  :max="8096"
                  class="custom-select-width"
                />
              </el-form-item>
            </div>
            <div v-if="form.type === 'TCP_SERVER'">
              <el-form-item
                v-if="form.type !== 'HTTP_SERVER'"
                label="HOST"
                :prop="'networkConfig.' + index + '.host'"
                :rules="[
                  { required: true, message: '请填写', trigger: 'blur' },
                ]"
              >
                <el-input v-model="item.host" maxlength="200"></el-input>
              </el-form-item>
              <el-form-item
                label="端口号"
                :prop="'networkConfig.' + index + '.port'"
                :rules="[
                  { required: true, message: '请填写', trigger: 'blur' },
                ]"
              >
                <el-input-number
                  v-model="item.port"
                  controls-position="right"
                  :min="0"
                  :max="65535"
                  class="custom-select-width"
                />
              </el-form-item>
              <el-form-item
                label="SSL"
                :prop="'networkConfig.' + index + '.secureLayer'"
                :rules="[
                  { required: true, message: '请选择', trigger: 'change' },
                ]"
              >
                <el-radio-group v-model="item.secureLayer">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="证书"
                :prop="'networkConfig.' + index + '.certificateId'"
                :rules="[
                  { required: true, message: '请选择', trigger: 'change' },
                ]"
              >
                <el-select
                  v-model="item.certificateId"
                  class="custom-select-width"
                  clearable
                >
                  <el-option
                    v-for="i in certificateOptions"
                    :key="i.value"
                    :value="i.value"
                    :label="i.label"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="解析方式"
                :prop="
                  'networkConfig.' + index + '.otherConf.messageUnpackType'
                "
                :rules="[
                  { required: true, message: '请选择', trigger: 'change' },
                ]"
              >
                <el-select
                  v-model="item.otherConf.messageUnpackType"
                  class="custom-select-width"
                  clearable
                >
                  <el-option
                    v-for="i in messageUnpackTypeOptions"
                    :key="i.value"
                    :value="i.value"
                    :label="i.label"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                v-if="[0, 1].includes(item.otherConf.messageUnpackType)"
                label="分隔符"
                :prop="'networkConfig.' + index + '.otherConf.delimiter'"
                :rules="[
                  { required: true, message: '请填写', trigger: 'blur' },
                ]"
              >
                <el-input
                  v-model="item.otherConf.delimiter"
                  maxlength="30"
                  clearable
                ></el-input>
              </el-form-item>

              <el-form-item
                v-if="[2].includes(item.otherConf.messageUnpackType)"
                label="消息定长"
                :prop="'networkConfig.' + index + '.otherConf.frameLength'"
                :rules="[
                  { required: true, message: '请填写', trigger: 'blur' },
                ]"
              >
                <el-input
                  v-model="item.otherConf.frameLength"
                  maxlength="30"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item
                v-if="[2].includes(item.otherConf.messageUnpackType)"
                label="消息长度偏移量"
                :prop="
                  'networkConfig.' + index + '.otherConf.lengthFieldOffset'
                "
                :rules="[
                  { required: true, message: '请填写', trigger: 'blur' },
                ]"
              >
                <el-input-number
                  v-model="item.otherConf.lengthFieldOffset"
                  controls-position="right"
                  :min="0"
                  :max="100"
                  class="custom-select-width"
                />
              </el-form-item>
              <el-form-item
                v-if="[2].includes(item.otherConf.messageUnpackType)"
                label="消息内容长度"
                :prop="
                  'networkConfig.' + index + '.otherConf.lengthFieldLength'
                "
                :rules="[
                  { required: true, message: '请填写', trigger: 'blur' },
                ]"
              >
                <el-input
                  v-model="item.otherConf.lengthFieldLength"
                  clearable
                ></el-input>
              </el-form-item>

              <el-form-item
                v-if="item.otherConf.messageUnpackType !== 2"
                label="最大消息长度"
                :prop="'networkConfig.' + index + '.otherConf.maxFramLength'"
                :rules="[
                  { required: true, message: '请填写', trigger: 'blur' },
                ]"
              >
                <el-input-number
                  v-model="item.otherConf.maxFramLength"
                  controls-position="right"
                  :min="1"
                  :max="8096"
                  class="custom-select-width"
                />
              </el-form-item>
            </div>
            <div v-if="form.type === 'HTTP_SERVER'">
              <el-form-item
                label="端口号"
                :prop="'networkConfig.' + index + '.port'"
                :rules="[
                  { required: true, message: '请填写', trigger: 'blur' },
                ]"
              >
                <el-input-number
                  v-model="item.port"
                  controls-position="right"
                  :min="0"
                  :max="65535"
                  class="custom-select-width"
                />
              </el-form-item>
              <el-form-item
                label="TLS"
                :prop="'networkConfig.' + index + '.secureLayer'"
                :rules="[
                  { required: true, message: '请选择', trigger: 'change' },
                ]"
              >
                <el-radio-group v-model="item.secureLayer">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="证书"
                :prop="'networkConfig.' + index + '.certificateId'"
                :rules="[
                  { required: true, message: '请选择', trigger: 'change' },
                ]"
              >
                <el-select
                  v-model="item.certificateId"
                  class="custom-select-width"
                  clearable
                >
                  <el-option
                    v-for="i in certificateOptions"
                    :key="i.value"
                    :value="i.value"
                    :label="i.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </template>

        <!-- 多选配置 -->
        <!-- 独立配置 -->
        <template v-if="form.networkConfig.length && form.clusterConf == 1">
          <div v-for="(item, index) in form.networkConfig" :key="item.key">
            <el-card class="card-box">
              <template #header>
                <div class="card-box-header">
                  <div
                    @click="item.isShow = !item.isShow"
                    class="card-box-left"
                  >
                    <i v-show="item.isShow" class="el-icon-arrow-down"></i>
                    <i v-show="!item.isShow" class="el-icon-arrow-right"></i>
                    <span>
                      {{ item.severName }}
                    </span>
                  </div>

                  <div
                    class="card-box-right"
                    v-if="form.networkConfig.length > 1 && mode !== 'LOOK'"
                  >
                    <i
                      class="el-icon-delete"
                      @click="handleDelConf(item, index)"
                    ></i>
                  </div>
                </div>
              </template>
              <el-collapse-transition>
                <div v-show="item.isShow">
                  <div v-if="form.type === 'MQTT_CLIENT'">
                    <el-form-item
                      label="客户端ID"
                      :prop="'networkConfig.' + index + '.otherConf.clientId'"
                      :rules="[
                        { required: true, message: '请填写', trigger: 'blur' },
                      ]"
                    >
                      <el-input
                        v-model="item.otherConf.clientId"
                        maxlength="30"
                        clearable
                      ></el-input>
                    </el-form-item>

                    <el-form-item
                      label="HOST"
                      :prop="'networkConfig.' + index + '.host'"
                      :rules="[
                        { required: true, message: '请填写', trigger: 'blur' },
                      ]"
                    >
                      <el-input
                        v-model="item.host"
                        maxlength="200"
                        clearable
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="端口号"
                      :prop="'networkConfig.' + index + '.port'"
                      :rules="[
                        {
                          required: true,
                          message: '请填写',
                          trigger: 'blur',
                        },
                      ]"
                    >
                      <el-input-number
                        v-model="item.port"
                        controls-position="right"
                        :min="0"
                        :max="65535"
                        class="custom-select-width"
                      />
                    </el-form-item>
                    <el-form-item
                      label="TLS"
                      :prop="'networkConfig.' + index + '.secureLayer'"
                      :rules="[
                        {
                          required: true,
                          message: '请选择',
                          trigger: 'change',
                        },
                      ]"
                    >
                      <el-radio-group v-model="item.secureLayer">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item
                      label="证书"
                      :prop="'networkConfig.' + index + '.certificateId'"
                      :rules="[
                        {
                          required: true,
                          message: '请选择',
                          trigger: 'change',
                        },
                      ]"
                    >
                      <el-select
                        v-model="item.certificateId"
                        class="custom-select-width"
                        clearable
                      >
                        <el-option
                          v-for="i in certificateOptions"
                          :key="i.value"
                          :value="i.value"
                          :label="i.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="用户名"
                      :prop="'networkConfig.' + index + '.otherConf.userName'"
                      :rules="[
                        { required: true, message: '请填写', trigger: 'blur' },
                      ]"
                    >
                      <el-input
                        v-model="item.otherConf.userName"
                        maxlength="30"
                        clearable
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="密码"
                      :prop="'networkConfig.' + index + '.otherConf.password'"
                      :rules="[
                        { required: true, message: '请填写', trigger: 'blur' },
                      ]"
                    >
                      <el-input
                        v-model="item.otherConf.password"
                        maxlength="64"
                        clearable
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="最大消息长度"
                      :prop="
                        'networkConfig.' + index + '.otherConf.maxFramLength'
                      "
                      :rules="[
                        { required: true, message: '请填写', trigger: 'blur' },
                      ]"
                    >
                      <el-input-number
                        v-model="item.otherConf.maxFramLength"
                        controls-position="right"
                        :min="1"
                        :max="8096"
                        class="custom-select-width"
                      />
                    </el-form-item>
                  </div>
                  <div v-if="form.type === 'MQTT_SERVER'">
                    <el-form-item
                      label="线程数"
                      :prop="'networkConfig.' + index + '.otherConf.threadNum'"
                      :rules="[
                        { required: true, message: '请填写', trigger: 'blur' },
                      ]"
                    >
                      <el-input-number
                        v-model="item.otherConf.threadNum"
                        controls-position="right"
                        :min="1"
                        :max="10"
                        class="custom-select-width"
                      />
                    </el-form-item>

                    <el-form-item
                      label="HOST"
                      :prop="'networkConfig.' + index + '.host'"
                      :rules="[
                        { required: true, message: '请填写', trigger: 'blur' },
                      ]"
                    >
                      <el-input v-model="item.host" maxlength="200"></el-input>
                    </el-form-item>
                    <el-form-item
                      label="端口号"
                      :prop="'networkConfig.' + index + '.port'"
                      :rules="[
                        {
                          required: true,
                          message: '请填写',
                          trigger: 'blur',
                        },
                      ]"
                    >
                      <el-input-number
                        v-model="item.port"
                        controls-position="right"
                        :min="0"
                        :max="65535"
                        class="custom-select-width"
                      />
                    </el-form-item>
                    <el-form-item
                      label="TLS"
                      :prop="'networkConfig.' + index + '.secureLayer'"
                      :rules="[
                        {
                          required: true,
                          message: '请选择',
                          trigger: 'change',
                        },
                      ]"
                    >
                      <el-radio-group v-model="item.secureLayer">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item
                      label="证书"
                      :prop="'networkConfig.' + index + '.certificateId'"
                      :rules="[
                        {
                          required: true,
                          message: '请选择',
                          trigger: 'change',
                        },
                      ]"
                    >
                      <el-select
                        v-model="item.certificateId"
                        class="custom-select-width"
                        clearable
                      >
                        <el-option
                          v-for="i in certificateOptions"
                          :key="i.value"
                          :value="i.value"
                          :label="i.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="最大消息长度"
                      :prop="
                        'networkConfig.' + index + '.otherConf.maxFramLength'
                      "
                      :rules="[
                        { required: true, message: '请填写', trigger: 'blur' },
                      ]"
                    >
                      <el-input-number
                        v-model="item.otherConf.maxFramLength"
                        controls-position="right"
                        :min="1"
                        :max="8096"
                        class="custom-select-width"
                      />
                    </el-form-item>
                  </div>
                  <div v-if="form.type === 'TCP_SERVER'">
                    <el-form-item
                      v-if="form.type !== 'HTTP_SERVER'"
                      label="HOST"
                      :prop="'networkConfig.' + index + '.host'"
                      :rules="[
                        { required: true, message: '请填写', trigger: 'blur' },
                      ]"
                    >
                      <el-input v-model="item.host" maxlength="200"></el-input>
                    </el-form-item>
                    <el-form-item
                      label="端口号"
                      :prop="'networkConfig.' + index + '.port'"
                      :rules="[
                        {
                          required: true,
                          message: '请填写',
                          trigger: 'blur',
                        },
                      ]"
                    >
                      <el-input-number
                        v-model="item.port"
                        controls-position="right"
                        :min="0"
                        :max="65535"
                        class="custom-select-width"
                      />
                    </el-form-item>
                    <el-form-item
                      label="SSL"
                      :prop="'networkConfig.' + index + '.secureLayer'"
                      :rules="[
                        {
                          required: true,
                          message: '请选择',
                          trigger: 'change',
                        },
                      ]"
                    >
                      <el-radio-group v-model="item.secureLayer">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item
                      label="证书"
                      :prop="'networkConfig.' + index + '.certificateId'"
                      :rules="[
                        {
                          required: true,
                          message: '请选择',
                          trigger: 'change',
                        },
                      ]"
                    >
                      <el-select
                        v-model="item.certificateId"
                        class="custom-select-width"
                        clearable
                      >
                        <el-option
                          v-for="i in certificateOptions"
                          :key="i.value"
                          :value="i.value"
                          :label="i.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="解析方式"
                      :prop="
                        'networkConfig.' +
                        index +
                        '.otherConf.messageUnpackType'
                      "
                      :rules="[
                        {
                          required: true,
                          message: '请选择',
                          trigger: 'change',
                        },
                      ]"
                    >
                      <el-select
                        v-model="item.otherConf.messageUnpackType"
                        class="custom-select-width"
                        clearable
                      >
                        <el-option
                          v-for="i in messageUnpackTypeOptions"
                          :key="i.value"
                          :value="i.value"
                          :label="i.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item
                      v-if="[0, 1].includes(item.otherConf.messageUnpackType)"
                      label="分隔符"
                      :prop="'networkConfig.' + index + '.otherConf.delimiter'"
                      :rules="[
                        { required: true, message: '请填写', trigger: 'blur' },
                      ]"
                    >
                      <el-input
                        v-model="item.otherConf.delimiter"
                        maxlength="30"
                        clearable
                      ></el-input>
                    </el-form-item>

                    <el-form-item
                      v-if="[2].includes(item.otherConf.messageUnpackType)"
                      label="消息定长"
                      :prop="
                        'networkConfig.' + index + '.otherConf.frameLength'
                      "
                      :rules="[
                        { required: true, message: '请填写', trigger: 'blur' },
                      ]"
                    >
                      <el-input
                        v-model="item.otherConf.frameLength"
                        maxlength="30"
                        clearable
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      v-if="[2].includes(item.otherConf.messageUnpackType)"
                      label="消息长度偏移量"
                      :prop="
                        'networkConfig.' +
                        index +
                        '.otherConf.lengthFieldOffset'
                      "
                      :rules="[
                        { required: true, message: '请填写', trigger: 'blur' },
                      ]"
                    >
                      <el-input-number
                        v-model="item.otherConf.lengthFieldOffset"
                        controls-position="right"
                        :min="0"
                        :max="100"
                        class="custom-select-width"
                      />
                    </el-form-item>
                    <el-form-item
                      v-if="[2].includes(item.otherConf.messageUnpackType)"
                      label="消息内容长度"
                      :prop="
                        'networkConfig.' +
                        index +
                        '.otherConf.lengthFieldLength'
                      "
                      :rules="[
                        { required: true, message: '请填写', trigger: 'blur' },
                      ]"
                    >
                      <el-input
                        v-model="item.otherConf.lengthFieldLength"
                        clearable
                      ></el-input>
                    </el-form-item>

                    <el-form-item
                      v-if="item.otherConf.messageUnpackType !== 2"
                      label="最大消息长度"
                      :prop="
                        'networkConfig.' + index + '.otherConf.maxFramLength'
                      "
                      :rules="[
                        { required: true, message: '请填写', trigger: 'blur' },
                      ]"
                    >
                      <el-input-number
                        v-model="item.otherConf.maxFramLength"
                        controls-position="right"
                        :min="1"
                        :max="8096"
                        class="custom-select-width"
                      />
                    </el-form-item>
                  </div>
                  <div v-if="form.type === 'HTTP_SERVER'">
                    <el-form-item
                      label="端口号"
                      :prop="'networkConfig.' + index + '.port'"
                      :rules="[
                        {
                          required: true,
                          message: '请填写',
                          trigger: 'blur',
                        },
                      ]"
                    >
                      <el-input-number
                        v-model="item.port"
                        controls-position="right"
                        :min="0"
                        :max="65535"
                        class="custom-select-width"
                      />
                    </el-form-item>
                    <el-form-item
                      label="TLS"
                      :prop="'networkConfig.' + index + '.secureLayer'"
                      :rules="[
                        {
                          required: true,
                          message: '请选择',
                          trigger: 'change',
                        },
                      ]"
                    >
                      <el-radio-group v-model="item.secureLayer">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item
                      label="证书"
                      :prop="'networkConfig.' + index + '.certificateId'"
                      :rules="[
                        {
                          required: true,
                          message: '请选择',
                          trigger: 'change',
                        },
                      ]"
                    >
                      <el-select
                        v-model="item.certificateId"
                        class="custom-select-width"
                        clearable
                      >
                        <el-option
                          v-for="i in certificateOptions"
                          :key="i.value"
                          :value="i.value"
                          :label="i.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
              </el-collapse-transition>
            </el-card>
            <br />
          </div>
          <el-button
            class="custom-btn"
            icon="el-icon-plus"
            @click="handleAddConf"
            v-if="mode !== 'LOOK'"
            >添加</el-button
          >
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

    <!-- 添加独立配置 -->
    <el-dialog title="新增" :visible.sync="open" width="680px" append-to-body>
      <el-form
        ref="addform"
        :model="addform"
        :rules="addRules"
        label-width="100px"
        @submit.native.prevent
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="服务ID" prop="severName">
              <el-input
                v-model="addform.severName"
                :maxlength="30"
                placeholder="请输入服务ID"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddName">确 定</el-button>
        <el-button @click="cancelAddName">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addType, updateType, getType } from "@/api/equipment/type";
import { deepClone } from "@/utils";
import { getCertificateOptions } from "@/api/equipment/certificate";

const clusterConfOptions = [
  { value: 0, label: "共享配置" },
  { value: 1, label: "独立配置" },
];

const messageUnpackTypeOptions = [
  { value: 0, label: "换行符" },
  { value: 1, label: "自定义分隔符" },
  { value: 2, label: "消息定长拆包" },
  { value: 3, label: "自定义拆包" },
];

// MQTT客户端  MQTT_CLIENT
// MQTT服务  MQTT_SERVER
// TCP服务  TCP_SERVER
// HTTP服务  HTTP_SERVER

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
        networkName: "",
        type: "",
        clusterConf: 0,
        remark: "",
        networkConfig: [],
      },
      rules: {
        networkName: [
          { required: true, message: "请输入组件名称", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        clusterConf: [
          { required: true, message: "请选择集群", trigger: "change" },
        ],
      },
      clusterConfOptions,
      messageUnpackTypeOptions,
      certificateOptions: [], // 证书列表
      dataCache1: [], // 共享配置缓存
      dataCache2: [], // 独立配置缓存
      addform: {
        severName: "",
      },
      addRules: {
        severName: [
          { required: true, message: "请输入服务ID", trigger: "blur" },
        ],
      },
      open: false,
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
    Promise.all([this.getCertificateList()]).then(async () => {
      if (this.mode !== "ADD") {
        const { id } = this.info;
        const { code, data } = await getType(id);
        if (code === 200) {
          const { networkName, type, clusterConf, remark, networkConfig } =
            data;
          this.form = {
            id,
            networkName,
            type,
            clusterConf,
            remark,
            networkConfig,
          };

          // 还原拼接数据
          this.form.networkConfig.forEach((i, index) => {
            if (index == 0) {
              this.$set(i, "isShow", true);
              this.$set(i, "key", Date.now() + index);
            } else {
              this.$set(i, "isShow", false);
              this.$set(i, "key", Date.now() + index);
            }
          });
        }
      } else {
        this.form = {
          networkName: "",
          type: "",
          clusterConf: 0,
          remark: "",
          networkConfig: [],
        };
      }
    });
  },
  methods: {
    /** 查询证书列表 */
    async getCertificateList() {
      try {
        const { code, data } = await getCertificateOptions({});
        if (code === 200) {
          this.certificateOptions = data;
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
        const copyObj = deepClone(this.form);
        // 处理数据
        copyObj.networkConfig.forEach((item) => {
          delete item.key;
          delete item.isShow;
        });

        if (this.form.id) {
          const { code, msg } = await updateType(copyObj);
          if (code === 200) {
            this.$modal.msgSuccess("修改成功");
            this.handleCancel(true);
          } else {
            this.$modal.msgError(msg);
          }
        } else {
          const { code, msg } = await addType(copyObj);
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

    // 初始化内容
    /*
    // MQTT客户端  MQTT_CLIENT
    // MQTT服务  MQTT_SERVER
    // TCP服务  TCP_SERVER
    // HTTP服务  HTTP_SERVER
    */
    initDataType(val) {
      if (val === "MQTT_CLIENT") {
        return {
          isShow: true,
          key: Date.now(),
          severName: "aiot-platform",
          host: "",
          port: "",
          secureLayer: null, // TLS || SSL
          certificateId: "",
          type: val,
          otherConf: {
            userName: "",
            password: "",
            clientId: "",
            maxFramLength: "",
          },
        };
      } else if (val === "MQTT_SERVER") {
        return {
          isShow: true,
          key: Date.now(),
          severName: "aiot-platform",
          host: "",
          port: "",
          secureLayer: null, // TLS || SSL
          certificateId: "",
          type: val,
          otherConf: {
            threadNum: "",
            maxFramLength: "",
          },
        };
      } else if (val === "TCP_SERVER") {
        return {
          isShow: true,
          key: Date.now(),
          severName: "aiot-platform",
          host: "",
          port: "",
          secureLayer: null, // TLS || SSL
          certificateId: "",
          type: val,
          otherConf: {
            //  0、换行符，1自定义分隔符，2消息定长拆包，3自定义拆包
            messageUnpackType: "",
            // 0、换行符，1自定义分隔符。分隔符
            delimiter: "",
            //  0、换行符，1自定义分隔符，3自定义拆包。消息最大长度
            // @ApiModelProperty(value = "最大消息长度")
            maxFrameLength: "",
            // 2 消息定长拆包，消息定长
            frameLength: "",
            //  计算消息长度的偏移量
            lengthFieldOffset: "",
            //  消息内容长度字节数
            lengthFieldLength: "",
          },
        };
      } else if (val === "HTTP_SERVER") {
        return {
          isShow: true,
          key: Date.now(),
          severName: "aiot-platform",
          port: "",
          secureLayer: null, // TLS || SSL
          certificateId: "",
          type: val,
          otherConf: {},
        };
      }
    },

    // 切换类型
    handleChangeType(val) {
      this.form.networkConfig = [];
      this.dataCache1 = [];
      this.dataCache2 = [];
      this.$nextTick(() => {
        if (val) {
          this.form.networkConfig.push(this.initDataType(val));
        }
        if (this.form.clusterConf == 0) {
          this.dataCache1 = this.form.networkConfig;
        } else {
          this.dataCache2 = this.form.networkConfig;
        }
      });
    },

    // 切换集群 缓存配置
    handleChangeCluster(val) {
      if (this.form.type) {
        if (val == 0) {
          this.dataCache2 = deepClone(this.form.networkConfig);
          if (!this.dataCache1.length) {
            this.form.networkConfig = [];
            this.form.networkConfig.push(this.initDataType(this.form.type));
          } else {
            this.form.networkConfig = this.dataCache1;
          }
        } else {
          this.dataCache1 = deepClone(this.form.networkConfig);
          if (!this.dataCache2.length) {
            this.form.networkConfig = [];
            this.form.networkConfig.push(this.initDataType(this.form.type));
          } else {
            this.form.networkConfig = this.dataCache2;
          }
        }
      }
    },
    handleDelConf(item, index) {
      this.form.networkConfig.splice(index, 1);
    },

    handleAddConf() {
      this.open = true;
    },
    async submitAddName() {
      try {
        const isValid = await new Promise((resolve) => {
          this.$refs.addform.validate(resolve);
        });
        if (!isValid) return;
        if (this.form.type) {
          const newObj = this.initDataType(this.form.type);
          newObj.severName = this.addform.severName;
          this.form.networkConfig.push(newObj);
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.cancelAddName();
      }
    },
    cancelAddName() {
      this.addform.severName = "";
      this.open = false;
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

.custom-btn {
  border: 1px dashed #5482ee;
  color: #5482ee;
  margin-bottom: 20px;
  width: 100%;
}
.card-box {
  margin-bottom: 10px;
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &-left {
    cursor: pointer;
  }
  &-right {
    cursor: pointer;
  }
}
</style>
