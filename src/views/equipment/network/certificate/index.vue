<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="" prop="certificateName">
        <el-input
          v-model="queryParams.certificateName"
          placeholder="请输入证书名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择证书类型"
          clearable
        >
          <el-option
            v-for="dict in dict.type.network_security_certificate"
            :key="dict.value"
            :value="dict.value"
            :label="dict.label"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>

      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-if="refreshTable" v-loading="loading" :data="tableList">
      <template #empty>
        <el-empty></el-empty>
      </template>
      <el-table-column prop="certificateName" label="证书名称">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="handleLook(row)">
            {{ row.certificateName }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        width="200"
      >
        <template #default="{ row }">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(row)"
            >编辑</el-button
          >

          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
        :disabled="mode === 'LOOK'"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="证书名称" prop="certificateName">
              <el-input
                v-model="form.certificateName"
                :maxlength="30"
                placeholder="请输入证书名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="类型" prop="type">
              <el-select
                v-model="form.type"
                placeholder="请选择证书类型"
                clearable
                class="custom-select-width"
                @change="handleChangeType"
              >
                <el-option
                  v-for="dict in dict.type.network_security_certificate"
                  :key="dict.value"
                  :value="dict.value"
                  :label="dict.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="信任库" prop="publicKey">
              <el-upload
                ref="upload1"
                :action="upload.url"
                :headers="upload.headers"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :on-remove="handleRemove"
                :limit="1"
                :file-list="upload.fileList"
              >
                <el-button
                  size="small"
                  plain
                  type="primary"
                  :disabled="upload.fileList.length > 0"
                  >点击上传</el-button
                >
                <div slot="tip" class="el-upload__tip">支持上传10M以内文件</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="form.type && form.type !== 'PEM'">
            <el-form-item label="信任库密码" prop="publicPassword">
              <el-input
                v-model="form.publicPassword"
                :maxlength="64"
                placeholder="请输入信任库密码"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="密钥库" prop="privateKey">
              <el-upload
                ref="upload2"
                :action="upload.url"
                :headers="upload.headers"
                :on-success="handleAvatarSuccess2"
                :before-upload="beforeAvatarUpload2"
                :on-remove="handleRemove2"
                :limit="1"
                :file-list="upload.fileList2"
              >
                <el-button
                  size="small"
                  plain
                  type="primary"
                  :disabled="upload.fileList2.length > 0"
                  >点击上传</el-button
                >
                <div slot="tip" class="el-upload__tip">支持上传10M以内文件</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="form.type && form.type !== 'PEM'">
            <el-form-item label="密钥库密码" prop="privatePassword">
              <el-input
                v-model="form.privatePassword"
                :maxlength="64"
                placeholder="请输入密钥库密码"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                :rows="3"
                v-model="form.remark"
                :maxlength="200"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitForm"
          :loading="btnLoading"
          v-if="mode != 'LOOK'"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCertificate,
  addCertificate,
  getCertificate,
  delCertificate,
  updateCertificate,
} from "@/api/equipment/certificate";

import request from "@/utils/request";
import { getToken } from "@/utils/auth";

import { deepClone } from "@/utils";

export default {
  name: "Certificate",
  components: {},
  dicts: ["network_security_certificate"],
  data() {
    return {
      btnLoading: false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 条数
      total: 0,
      // 产品数据
      tableList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        certificateName: "",
        type: "",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        certificateName: [
          { required: true, message: "证书名称不能为空", trigger: "blur" },
        ],
        type: [{ required: true, message: "类型不能为空", trigger: "blur" }],
        publicKey: [
          { required: true, message: "信任库不能为空", trigger: "change" },
        ],
      },
      upload: {
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: `${request.baseURL}/file/file/upload`,
        fileList: [],
        fileList2: [],
      },
      mode: "ADD",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { code, data } = await listCertificate(this.queryParams);
        if (code === 200) {
          this.tableList = data.list;
          this.total = data.total;
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        certificateName: "",
        type: "",
        publicKey: "",
        publicPassword: "",
        privateKey: "",
        privatePassword: "",
        remark: "",
      };
      this.upload.fileList = [];
      this.upload.fileList2 = [];
      this.resetForm("form");
      this.mode = "ADD";
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增证书";
    },

    /** 修改按钮操作 */
    async handleUpdate(row) {
      try {
        this.reset();
        const { code, data } = await getCertificate(row.id);
        if (code === 200) {
          const {
            id,
            certificateName,
            type,
            publicKey,
            publicPassword,
            privateKey,
            privatePassword,
            remark,
          } = data;
          this.form = {
            id,
            certificateName,
            type,
            publicKey,
            publicPassword,
            privateKey,
            privatePassword,
            remark,
          };
          this.upload.fileList = [{ name: publicKey, url: publicKey }];
          if (privateKey) {
            this.upload.fileList2 = [{ name: privateKey, url: privateKey }];
          }
          this.open = true;
          this.title = "修改证书";
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

        if (this.form.id) {
          const { code, msg } = await updateCertificate(copyForm);
          if (code === 200) {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          } else {
            this.$modal.msgError(msg);
          }
        } else {
          const { code, msg } = await addCertificate(copyForm);
          if (code === 200) {
            this.$modal.msgSuccess("创建成功");
            this.open = false;
            this.getList();
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
    /** 删除按钮操作 */
    async handleDelete(row) {
      try {
        const res = await this.$confirm(
          '是否确认删除名称为"' + row.certificateName + '"的数据项？',
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );

        if (res === "confirm") {
          const { code } = await delCertificate(row.id);
          if (code === 200) {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    async handleLook(row) {
      await this.handleUpdate(row);
      this.mode = "LOOK";
      this.title = "查看证书";
    },

    handleChangeType(val) {
      if (val === "PEM") {
        this.form.publicPassword = "";
        this.form.privatePassword = "";
      }
    },
    handleAvatarSuccess(res, file) {
      if (res.code === 200) {
        this.upload.fileList.push({ name: res.data, url: res.data });
        this.form.publicKey = res.data;
      } else {
        this.$modal.msgError("上传失败");
        this.upload.fileList = [];
        this.$refs.upload1.clearFiles();
      }
    },
    beforeAvatarUpload(file) {
      // const isJPG = ["image/jpeg", "image/jpg", "image/png"].includes(
      //   file.type
      // );
      const isLt10M = file.size / 1024 / 1024 < 10;

      // if (!isJPG) {
      //   this.$message.error("上传图片只能是 JPG,PNG 格式!");
      // }
      if (!isLt10M) {
        this.$message.error("上传文件大小不能超过 10MB!");
      }
      return isLt10M;
    },
    handleRemove(file) {
      this.upload.fileList = [];
      this.form.publicKey = "";
      this.$refs.upload1.clearFiles();
    },
    handleAvatarSuccess2(res, file) {
      if (res.code === 200) {
        this.upload.fileList2.push({ name: res.data, url: res.data });
        this.form.privateKey = res.data;
      } else {
        this.$modal.msgError("上传失败");
        this.upload.fileList2 = [];
        this.$refs.upload2.clearFiles();
      }
    },
    beforeAvatarUpload2(file) {
      // const isJPG = ["image/jpeg", "image/jpg", "image/png"].includes(
      //   file.type
      // );
      const isLt10M = file.size / 1024 / 1024 < 10;

      // if (!isJPG) {
      //   this.$message.error("上传图片只能是 JPG,PNG 格式!");
      // }
      if (!isLt10M) {
        this.$message.error("上传文件大小不能超过 10MB!");
      }
      return isLt10M;
    },
    handleRemove2(file) {
      this.upload.fileList2 = [];
      this.form.privateKey = "";
      this.$refs.upload2.clearFiles();
    },
  },
};
</script>
<style lang="scss" scoped></style>
