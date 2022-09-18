<template>
  <section class="app-main" :style="{width}">
    <transition name="fade" mode="out-in">
      <!-- <router-view :key="key"></router-view> -->
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  props: {
    width: {
      type: String,
      default: '100%'
    }
  },
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>
<style lang="stylus">
  .app-main
    position absolute
    height 100%
</style>
