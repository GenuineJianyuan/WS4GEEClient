<template>
  <scroll-bar>
    <el-menu
      id="menu"
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import ScrollBar from "@/components/ScrollBar";

export default {
  components: { SidebarItem, ScrollBar },
  data() {
    return {};
  },
  methods: {
    calWidth() {
      setTimeout(() => {
        this.width = document.getElementById("menu").clientWidth;
        this.$emit("width", this.width);
      }, 300); //缩放时候宽度不变
    }
  },
  mounted() {
    this.calWidth();
    window.addEventListener("resize", this.calWidth);
  },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      return this.$router.options.manageRoutes;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  watch: {
    isCollapse: {
      immediate: false,
      handler: function() {
        this.calWidth();
      }
    }
  }
};
</script>
