<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger
      class="hamburger-container"
      :toggleClick="toggleSideBar"
      :isActive="sidebar.opened"
    ></hamburger>
    <div
      style="height: 50px;display: flex;width: 100%;position: absolute;left: 50px;background: #304156;"
    >
      <span style="color: #fff;font-size: 1.1rem;line-height: 50px;"
        >WS4GEE Client</span
      >
    </div>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img class="user-avatar" src="../../../../static/icon/boy1.png" />
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <el-dropdown-item>
          <span @click="goHome" style="display:block;">首页</span>
        </el-dropdown-item>
        <el-dropdown-item>
          <div>
            <span @click="goManage" style="display:block;">后台管理</span>
          </div>
        </el-dropdown-item>
        <el-dropdown-item>
          <span @click="logout" style="display:block;">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    logout() {
      //            this.$store.dispatch('LogOut').then(() => {
      //                location.reload() // 为了重新实例化vue-router对象 避免bug
      //            })
      this.$router.push("/login");
    },
    goHome() {
      this.$router.push("/home");
    },
    goUserInfoEdit() {
      this.$router.push("/userInfoEdit");
    },
    goManage() {
      this.$router.push({ path: "/manager" });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@media screen and (max-width: 420px) {
  .user-avatar {
    width: 30px;
    height: 30px;
    border-radius: 10px;
  }
}

.navbar {
  height: 51px;
  border-radius: 0px !important;
  background: #304156;
  position: fixed;
  width: 100%;
  z-index: 999;
  right: 20px;
  left: 0px;

  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: #304156;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 15px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 10px;
      position: relative;
      .user-avatar {
        width: 30px;
        height: 30px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -15px;
        top: 20px;
        font-size: 12px;
      }
    }
  }
}
</style>
