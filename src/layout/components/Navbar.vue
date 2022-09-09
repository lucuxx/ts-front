<template>
  <div class="navbar">
    <div class="left-wrap">
      <!-- <img :src="logo" class="sidebar-logo" /> -->
      <h3 class="logo" @click="$router.push('/')">{{ title }}</h3>

      <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" />
    </div>

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <search id="header-search" class="right-menu-item" />

        <!-- <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <!-- <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <!-- <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <!-- <img :src="avatar" class="user-avatar"> -->
          <div class="user-avatar">
            <el-avatar icon="el-icon-user-solid" size="small"></el-avatar>
            <span class="username-style">{{ username }}</span>
          </div>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <!-- <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item> -->
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TopNav from "@/components/TopNav";

import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import RuoYiGit from "@/components/RuoYi/Git";
import RuoYiDoc from "@/components/RuoYi/Doc";
import logoImg from "@/assets/logo/logo.png";
import { title } from "@/settings";

export default {
  components: {
    TopNav,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc,
  },
  data() {
    return {
      logo: logoImg,
      title: title,
      username: this.$store.getters.name,
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device"]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav;
      },
    },
  },
  methods: {
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            location.href = "/index";
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  // background: #fff;
  background: #{$base-header-background};
  // background: #324396;
  // background: #{$theme};
  // background-image: linear-gradient(125deg, #89e1d9 0%, #5f73d4 24%);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .topmenu-container {
    // position: absolute;
    // left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .left-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 60px;
    line-height: 60px;
    padding-left: 20px;
    .sidebar-logo {
      display: inline-block;
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }
    h3 {
      color: #fff;
      margin-right: 50px;
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 60px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #fafafa;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        // margin-top: 8px;
        position: relative;

        .user-avatar {
          display: flex;
          height: 100%;
          justify-content: center;
          align-items: center;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.logo {
  font-weight: 700;
  cursor: pointer;
}
.username-style {
  line-height: 60px;
  display: inline-block;
  font-size: 16px;
  margin-left: 8px;
}
</style>
