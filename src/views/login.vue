<template>
  <div class="login">
    <div class="content">
      <div class="content-left">
        <div class="content-banner"></div>
      </div>

      <div class="content-right">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
        >
          <h3 class="title">{{ title }}</h3>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              type="text"
              auto-complete="off"
              placeholder="账号"
              size="medium"
            >
              <svg-icon
                slot="prefix"
                icon-class="user"
                class="el-input__icon input-icon"
              />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              auto-complete="off"
              placeholder="密码"
              @keyup.enter.native="handleLogin"
            >
              <svg-icon
                slot="prefix"
                icon-class="password"
                class="el-input__icon input-icon"
              />
            </el-input>
          </el-form-item>
          <el-form-item prop="code" v-if="captchaEnabled">
            <el-input
              v-model="loginForm.code"
              auto-complete="off"
              placeholder="验证码"
              style="width: 63%"
              @keyup.enter.native="handleLogin"
            >
              <svg-icon
                slot="prefix"
                icon-class="validCode"
                class="el-input__icon input-icon"
              />
            </el-input>
            <div class="login-code">
              <img :src="codeUrl" @click="getCode" class="login-code-img" />
            </div>
          </el-form-item>
          <el-checkbox
            v-model="loginForm.rememberMe"
            style="margin: 0px 0px 25px 0px"
            >记住密码</el-checkbox
          >
          <el-form-item style="width: 100%">
            <br />
            <el-button
              :loading="loading"
              size="medium"
              type="primary"
              style="width: 100%"
              @click.native.prevent="handleLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
            <div style="float: right" v-if="register">
              <router-link class="link-type" :to="'/register'"
                >立即注册</router-link
              >
            </div>
            <div class="footer-bar">由Sky-team提供技术支持</div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import { title } from "@/settings";

export default {
  name: "Login",
  data() {
    return {
      title: title,
      codeUrl: "",
      loginForm: {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: "",
        uuid: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" },
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" },
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }],
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then((res) => {
        this.captchaEnabled =
          res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" }).catch(() => {});
            })
            .catch(() => {
              this.loading = false;
              if (this.captchaEnabled) {
                this.getCode();
              }
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  // background-image: url("../assets/images/logo_bg.jpg");
  background-image: url("../assets/images/login-bg2.jpg");
  background-size: cover;
  background-position: center;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
  font-weight: 600;
}
.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 800px;
  // min-width: 700px;
  height: 500px;
  // min-height: 400px;
  border-radius: 8px;
  box-shadow: 0 1px 2px -2px #00000029, 0 3px 6px #0000001f,
    0 5px 12px 4px #00000017;
  background-color: #fff;
}

.content-left {
  width: 335px;
  height: 100%;
  background-image: url("../assets/images/login-bg.png");
  background-size: cover;
  background-position: center;
}

.content-right {
  flex: 1;
  height: 100%;
  width: 100%;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 100%;
  height: 100%;
  padding: 30px;
  ::v-deep .el-input {
    height: 42px;
    margin-bottom: 10px;
    input {
      height: 42px;
    }
  }
  .input-icon {
    height: 42px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
.footer-bar {
  margin-top: 40px;
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #c9c9c9;
}
</style>
