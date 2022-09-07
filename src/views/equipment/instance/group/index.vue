<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="" prop="groupName">
        <el-input
          v-model="queryParams.groupName"
          placeholder="请输入设备组名称"
          clearable
        />
      </el-form-item>

      <el-form-item label="" prop="deptId">
        <treeselect
          v-model="queryParams.deptId"
          :options="deptOptions"
          :show-count="false"
          placeholder="请选择所属机构"
          style="width: 215px"
        />
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

    <el-table v-if="refreshTable" v-loading="loading" :data="dataList">
      <template #empty>
        <el-empty></el-empty>
      </template>
      <el-table-column
        prop="groupName"
        label="组名"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="deptName"
        label="所属机构"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.remark ? row.remark : "--" }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >编辑</el-button
          >

          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="设备组名称" prop="groupName">
              <el-input
                v-model="form.groupName"
                placeholder="请输入设备名称"
                maxlength="30"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所属机构" prop="deptId">
              <treeselect
                v-model="form.deptId"
                :options="deptOptions"
                :show-count="false"
                placeholder="请选择所属机构"
              />
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
        <el-button type="primary" @click="submitForm" :loading="btnLoading"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { treeselect } from "@/api/system/dept";
import {
  listGroup,
  addGroup,
  getGroup,
  delGroup,
  updateGroup,
} from "@/api/equipment/group";

import { deepClone } from "@/utils";

export default {
  name: "Group",
  components: { Treeselect },
  data() {
    return {
      btnLoading: false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 条数
      total: 0,
      // 表格数据
      dataList: [],
      // 分类树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部折叠
      // isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        groupName: "",
        deptId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        groupName: [
          { required: true, message: "设备组名称不能为空", trigger: "blur" },
        ],
        deptId: [
          { required: true, message: "请选择所属机构", trigger: "change" },
        ],
      },
      deptOptions: [],
    };
  },
  created() {
    this.getList();
    this.getDeptList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { code, data } = await listGroup(this.queryParams);
        if (code === 200) {
          this.dataList = data.list;
          this.total = data.total;
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

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
        groupName: "",
        deptId: null,
        remark: "",
      };
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增分组";
    },

    /** 修改按钮操作 */
    async handleUpdate(row) {
      try {
        this.reset();
        const { code, data } = await getGroup(row.id);
        if (code === 200) {
          const { id, groupName, deptId, remark } = data;
          this.form = {
            id,
            groupName,
            deptId,
            remark,
          };
          this.open = true;
          this.title = "修改分组";
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
          const { code, msg } = await updateGroup(copyForm);
          if (code === 200) {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          } else {
            this.$modal.msgError(msg);
          }
        } else {
          const { code, msg } = await addGroup(copyForm);
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
          '是否确认删除名称为"' + row.groupName + '"的数据项？',
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );

        if (res === "confirm") {
          const { code } = await delGroup(row.id);
          if (code === 200) {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
