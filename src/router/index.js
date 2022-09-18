import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "../views/layout/Layout";

const HomePage = () => import("@/views/home/HomePage");
const ServiceRegistration = () => import("@/views/home/Registration");
const SearchEngine = () => import("@/views/home/SearchEngine");
const Visualization = () => import("@/views/home/Visualization");
const ProcessClient=()=>import("@/views/home/ProcessClient")
const Tutorial=()=>import("@/views/home/Tutorial")
export const constantRouterMap = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: "",
    component: Layout,
    name: "home",
    meta: {
      // title: "首页",
      title: "Home",
      icon: "home"
    },
    children: [
      {
        path: "home",
        name: "home",
        component: HomePage,
        meta: {
          // title: "首页",
          title: "Home",
          icon: "home"
        }
      }
    ]
  },
  {
    path: "",
    component: Layout,
    name: "registration",
    meta: {
      // title: "首页",
      title: "ServiceRegistration",
      icon: "home"
    },
    children: [
      {
        path: 'registration',
        name: 'ServiceRegistration',
        component: ServiceRegistration,
        meta: {
          // title: "首页",
          title: "Registration",
          icon: "egPlanList"
        }
      }
    ]
  },
  {
    path: "",
    component: Layout,
    name: "home",
    meta: {
      // title: "首页",
      title: "Resource Preview",
      icon: "SearchEngine"
    },
    children: [
      {
        path: 'search',
        name: 'Resource Preview',
        component: SearchEngine,
        meta: {
          // title: "首页",
          title: "Resource Preview",
          icon: "egBook"
        }
      }
    ]
  },
  {
    path: "",
    component: Layout,
    name: "home",
    meta: {
      // title: "首页",
      title: "Process Client",
      icon: "SearchEngine"
    },
    children: [
      {
        path: 'process',
        name: 'Process Client',
        component: ProcessClient,
        meta: {
          // title: "首页",
          title: "Process Client",
          icon: "egBook"
        }
      }
    ]
  },

  // {
  //   path: "",
  //   component: Layout,
  //   name: "resource",
  //   meta: {
  //     // title: "服务资源",
  //     title: "Visualization",
  //     icon: "egPlanList"
  //
  //   },
  //   children: [
  //      {
  //       path: 'visualization',
  //       name: 'Visualization',
  //       component: Visualization,
  //       meta: {
  //         // title: "首页",
  //         title: "Visualization",
  //         icon: "egBook"
  //       }
  //     }]
  // },
  {
    path: "",
    component: Layout,
    name: "home",
    meta: {
      // title: "首页",
      title: "Tutorial",
    },
    children: [
      {
        path: 'tutorial',
        name: 'Tutorial',
        component: Tutorial,
        meta: {
          // title: "首页",
          title: "Tutorial",
          icon: "egBook"
        }
      }
    ]
  }
];

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
});
