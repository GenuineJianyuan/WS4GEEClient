import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n
import "@/styles/index.scss"; // global css

import App from "./App";
import router from "./router";
import store from "./store";
import 'vue-cesium/lib/style.css'
import "@/icons"; // icon
import "./assets/css/button.css";
import global from "./global";
import axios from "axios";
//在main.js引入qs
import qs from  'qs'

//配全局属性配置，在任意组件内可以使用this.$qs获取qs对象

Vue.use(ElementUI, {
  locale
});

//设置axios为form-data
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [function (data) {
  let ret = ''
  for (let it in data) {
    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
  }
  return ret
}]

Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.prototype.global = global;
Vue.prototype.$qs = qs
Vue.prototype.HOST = "/api";

new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: {
    App
  }
});
