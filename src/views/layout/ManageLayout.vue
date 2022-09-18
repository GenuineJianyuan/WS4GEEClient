<template>
  <div class="app-wrapper" :class="classObj">
    <managerBar class="sidebar-container" @width="setWidth"></managerBar>
    <div class="main-container">
      <navbar></navbar>
      <app-main :width="width"></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, AppMain} from './components'
import ResizeMixin from './mixin/ResizeHandler'
import ManagerBar from './components/ManagerBar'

export default {
  name: 'layout',
  components: {
    Navbar,
    ManagerBar,
    AppMain
  },
  data () {
    return {
      width: '100%'
    }
  },
  methods: {
    setWidth (value) {
      if(window.innerWidth<=1027){
        this.width =  '100%'
      }else{
        this.width = (window.innerWidth - value) + 'px'
      }
    }
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../../src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: absolute;
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    top:0px;
    bottom: 0px;
  }

  html,body{
    margin: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  .app-wrapper::-webkit-scrollbar {
    width: 3px;
    background-color: #bbb;
  }

</style>

