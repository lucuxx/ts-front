<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="" prop="codecName">
        <el-input
          v-model="queryParams.codecName"
          placeholder="请输入协议名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
        >
          <el-option
            v-for="item in statusListMap"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
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
      <el-table-column prop="id" label="协议ID"></el-table-column>
      <el-table-column prop="codecName" label="协议名称">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="handleLook(row)">
            {{ row.codecName }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="" label="类型">jar</el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          {{ row.status == 0 ? "未发布" : "已发布" }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        width="200"
      >
        <template #default="{ row }">
          <template v-if="!row.status">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-video-play"
              @click="handlePublish(row, 1)"
              >发布</el-button
            >
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
          <template v-else>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-video-pause"
              @click="handlePublish(row, 2)"
              >取消发布</el-button
            >
          </template>
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
        :disabled="mode == 'LOOK'"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="协议名称" prop="codecName">
              <el-input
                v-model="form.codecName"
                maxlength="30"
                placeholder="请输入协议名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="类型">
              <!-- <el-input v-model="form.name" /> -->
              jar
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="类名" prop="className">
              <el-input v-model="form.className" maxlength="500" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上传jar包" prop="jarFileKey">
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
  listMessageCodec,
  addMessageCodec,
  getMessageCodec,
  delMessageCodec,
  updateMessageCodec,
  deployMessageCodec,
  undeployMessageCodec,
} from "@/api/equipment/protocal";

import request from "@/utils/request";
import { getToken } from "@/utils/auth";

import { deepClone } from "@/utils";

const statusListMap = [
  { value: 0, label: "未发布" },
  { value: 1, label: "已发布" },
];

export default {
  name: "Protocal",
  components: {},
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
        codecName: "",
        status: "",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        codecName: [
          { required: true, message: "协议名称不能为空", trigger: "blur" },
        ],
        className: [
          { required: true, message: "类名不能为空", trigger: "blur" },
        ],
        jarFileKey: [
          { required: true, message: "jar包不能为空", trigger: "change" },
        ],
      },
      upload: {
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: `${request.baseURL}/file/file/upload`,
        fileList: [],
      },
      mode: "ADD",
      statusListMap,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        console.log(this.queryParams, "this.queryParams");
        const { code, data } = await listMessageCodec(this.queryParams);
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
        codecName: "",
        className: "",
        jarFileKey: "",
        remark: "",
      };
      this.upload.fileList = [];
      this.resetForm("form");
      this.mode = "ADD";
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增协议";
    },

    /** 修改按钮操作 */
    async handleUpdate(row) {
      try {
        this.reset();
        const { code, data } = await getMessageCodec(row.id);
        if (code === 200) {
          const { id, codecName, className, jarFileKey, remark } = data;
          this.form = {
            id,
            codecName,
            className,
            jarFileKey,
            remark,
          };
          this.upload.fileList = [{ name: jarFileKey, url: jarFileKey }];
          this.open = true;
          this.title = "修改协议";
        }
      } catch (err) {
        console.log(err);
      }
    },

    // 发布  val 1：发布 2: 取消发布
    async handlePublish(row, val) {
      try {
        let name = "发布";
        if (val === 2) {
          name = "取消发布";
        }

        const res = await this.$confirm(
          `是否确认${name}名称为(${row.codecName})的数据项？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );

        if (res === "confirm") {
          if (val == 1) {
            const { code, msg } = await deployMessageCodec(row.id);
            this.resultFun(code, msg);
          } else {
            const { code, msg } = await undeployMessageCodec(row.id);
            this.resultFun(code, msg);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },

    resultFun(code, msg) {
      if (code === 200) {
        this.getList();
        this.$modal.msgSuccess("操作成功");
      } else {
        this.$modal.msgError(msg || "网络异常，请稍后再试");
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
          const { code, msg } = await updateMessageCodec(copyForm);
          if (code === 200) {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          } else {
            this.$modal.msgError(msg);
          }
        } else {
          const { code, msg } = await addMessageCodec(copyForm);
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
          '是否确认删除名称为"' + row.codecName + '"的数据项？',
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );

        if (res === "confirm") {
          const { code } = await delMessageCodec(row.id);
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
      this.title = "查看协议";
    },

    handleAvatarSuccess(res, file) {
      if (res.code === 200) {
        this.upload.fileList.push({ name: res.data, url: res.data });
        this.form.jarFileKey = res.data;
      } else {
        this.$modal.msgError("上传失败");
        this.upload.fileList = [];
        this.$refs.upload1.clearFiles();
      }
    },
    beforeAvatarUpload(file) {
      const isJAR = ["jar"].includes(file.type);
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJAR) {
        this.$message.error("上传图片只能是JAR 格式!");
      }
      if (!isLt10M) {
        this.$message.error("上传文件大小不能超过 10MB!");
      }
      return isJAR && isLt10M;
    },
    handleRemove(file) {
      this.upload.fileList = [];
      this.form.jarFileKey = "";
      this.$refs.upload1.clearFiles();
    },
  },
};
</script>
<style lang="scss" scoped></style>
