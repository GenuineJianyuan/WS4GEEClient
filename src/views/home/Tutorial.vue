<template>
  <div class="containers">
    <el-header class="header">
      <div class="logo">Tutorial to use WS4GEE System is releasing soon</div>
    </el-header>
    <div class="content">
      <el-collapse v-model="activeNames" >
        <el-collapse-item title="WS4GEE Client Tutorial" name="1">
          <div><el-link type="primary" :href="getFile('tutorial')">Download Tutorial</el-link> </div>
          <div><el-link type="primary" :href="getExperimentalData()">Download Experimental Data</el-link></div>
        </el-collapse-item>
        <el-collapse-item title="WS4GEE Server Instruction" name="2">
          <div><el-link type="primary" :href="getFile('instruction')">Download Instruction File</el-link> </div>
          <div><el-link type="primary" disabled>Download Experimental Data</el-link></div>
        </el-collapse-item>
        <el-collapse-item title="Further Development" name="3">
          <div> In the next version, the following goals will be considered with priority:</div>
          <div>(1) Jupyter notebook is planning to be embeded into the system to allow high-efficient GEE code/templates editing
            to facilitate GEE-enabled WPS registration</div>
          <div>(2) The integration with the Python package geemap is on the way for better interaction experience. See "https://geemap.org/" for more infomation</div>
          <div>(3) More GEE functions and common-used GEE models will be deployed;</div>
          <div>(4) Embed geo-workflow into the system; </div>
          <div> We welcome all well-intentioned criticisms and suggestions. If you have any comments or suggestions for this project,
            please contact with the following email: jliang@whu.edu.cn</div>
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
  },
  methods:{
    getFile(fileName){
      return "api/ws4gee/tutorial?fileName="+fileName
    },
    getExperimentalData(){
      return "api/ws4gee/experimentalData"
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

  margin-left: -100px;
  line-height: 50px;
}






</style>
