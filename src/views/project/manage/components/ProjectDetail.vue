<template>
  <div class="body">
    <div class="body-top">
      <el-form :rules="rules" ref="ruleForm" :model="form" label-width="80px">
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
        <el-form-item label="项目ID">
          <el-input v-model="form.projectId" disabled></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="form.projectName"
            :maxlength="30"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="所属机构" prop="deptId">
          <treeselect
            v-model="form.deptId"
            :options="deptOptions"
            :show-count="false"
            placeholder="选择所属机构"
          />
        </el-form-item>
        <el-form-item label="项目状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in projectStatusMap"
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
import { treeselect } from "@/api/system/dept";
import { addProject, updateProject } from "@/api/project/manage";

const projectStatusMap = [
  {
    value: "0",
    label: "正常",
  },
  { value: "1", label: "停用" },
];

export default {
  name: "ProjectDetail",
  components: { Treeselect },
  props: {
    projectInfo: {
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
      projectStatusMap,
      btnLoading: false,
      form: {
        projectId: "",
        projectName: "",
        deptId: null,
        status: "0",
        remark: "",
      },
      rules: {
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
        ],
        deptId: [
          { required: true, message: "请选择所属机构", trigger: "change" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },

      deptOptions: [],
    };
  },

  created() {
    this.getDeptList();
    if (this.mode !== "ADD") {
      console.log(this.projectInfo, "this.projectInfo");
      const { projectId, projectName, dept, status, remark } = this.projectInfo;
      this.form = {
        projectId,
        projectName,
        deptId: dept.deptId,
        status,
        remark,
      };
    } else {
      this.form = {
        projectId: "",
        projectName: "",
        deptId: null,
        status: "0",
        remark: "",
      };
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
        if (this.form.projectId) {
          const { code, msg } = await updateProject(this.form);
          if (code === 200) {
            this.$modal.msgSuccess("修改成功");
            this.handleCancel(true);
          } else {
            this.$modal.msgError(msg);
          }
        } else {
          const { code, msg } = await addProject(this.form);
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
