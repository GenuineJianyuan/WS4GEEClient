<template>
  <div class="containers">
    <el-header class="header">
      <div class="logo">Tutorial to use WS4GEE System is releasing soon</div>
    </el-header>
    <div class="content">
      <el-collapse v-model="activeNames" >
        <el-collapse-item title="Registration Tutorial" name="1">
          <div><el-link type="primary">Download Instruction File</el-link> </div>
          <div><el-link type="primary">Download Experimental Data</el-link></div>
        </el-collapse-item>
        <el-collapse-item title="Process Client Tutorial" name="2">
          <div><el-link type="primary">Download Instruction File</el-link> </div>
          <div><el-link type="primary">Download Experimental Data</el-link></div>
        </el-collapse-item>
        <el-collapse-item title="Resource Preview Tutorial" name="3">
          <div><el-link type="primary">Download Instruction File</el-link> </div>
        </el-collapse-item>
        <el-collapse-item title="WS4GEEServerManager Deploy Tutorial" name="3">
          <div><el-link type="primary">Download Instruction File</el-link> </div>
        </el-collapse-item>
        <el-collapse-item title="Further Development" name="3">
          <div>Comming soon...</div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tutorial",
  data(){
    return{
      activeNames: ['1']
    }
  }
}
</script>

<style scoped lang="stylus">
.containers {
  position: absolute;
  top: 60px;
  left: 10px;
  right: 0;
  bottom: 0px;
  background-color: #ffffff;
  width: 100%;
  height: 90%;
}

.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100px !important;
  font-size: 22px;
  color: black;
  background: #f6fdff;
}

.header .logo {
  text-align: center;
  font-size: 25px;
  float: right;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -25px;

  margin-left: -200px;
  line-height: 50px;
}






</style>
