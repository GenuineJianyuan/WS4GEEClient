<template>
  <div class="home-container">
    <el-header class="header">
      <div class="logo">WS4GEE Client System</div>
    </el-header>


    <el-row class="box-otherinfo" gutter=10>
      <el-col :xs="24" :sm="24" :lg="8">
        <div id="otherinfo1" class="otherinfo1" style="text-align: center;">
          <svg-icon style="width: 50px; height: 50px; margin-top: 50px" iconClass="dizhi"/>
          <div style="wmargin-bottom: 5px; line-height: 35px;font-size: 16px">Address</div>
          <div style="wmargin-bottom: 5px; line-height: 35px;font-size: 16px">China ·  129 Luoyu Street</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div id="otherinfo2" class="otherinfo2" style="text-align: center; ">
          <svg-icon style="width: 50px; height: 50px;margin-top: 50px" iconClass="youxiang"/>
          <div style="wmargin-bottom: 5px; line-height: 35px;font-size: 16px">Email</div>
          <div style="wmargin-bottom: 5px; line-height: 35px;font-size: 16px">geosquare@whu.edu.cn</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div id="otherinfo3" class="otherinfo3" style="text-align: center;">
          <svg-icon style="width: 50px; height: 50px;margin-top: 50px" iconClass="dianhua"/>
          <div style="wmargin-bottom: 5px; line-height: 35px;font-size: 16px">Phone</div>
          <div style="wmargin-bottom: 5px; line-height: 35px;font-size: 16px">027-68777110</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      // searchWidth:(window.innerWidth - 20)/3 + 'px',

    };
  },
  methods: {


  },
  computed: {
    searchWidth() {
      return (window.innerWidth - 240) / 3 + 'px';
    }
  },

};
</script>

<style scoped>
.home-container {
  margin: 0;
  overflow: hidden;
  bottom: 0;
  right: 0;
  width: 100%;
  padding: 50px 20px 20px 20px;
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
  font-size: 35px;
  float: right;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -25px;
  width: 400px;
  margin-left: -200px;
  line-height: 50px;
}

.el-menu {
  background-color: #304156;
  margin-bottom: 10px;
  text-align: center;
}

.el-menu :hover {
  background-color: #304156 !important;
}

.el-menu-item {
  min-width: 150px !important;
  background-color: #304156 !important;
  color: #fff !important;
  text-align: center
}

.el-menu-item:hover {
  background-color: #25313f !important;
  color: #fff !important;
}

.box-abstract {
  height: 200px;
  margin-bottom: 10px;
}

.box-linechart {
  height: 400px;
  margin-bottom: 10px;
  background: rgb(255, 255, 255);
}

.linechart {
  left: 0;
  right: 0;
  height: 400px;
  width: 100%;
  top: 0;
}

.barchart {
  height: 500px;
  width: 100%;
}

.piechart {
  height: 500px;
  width: 100%;
}

.box-tablechart {
  height: 500px;
  margin-bottom: 10px;
}

.box-otherinfo {
  height: 300px;
}

.otherinfo1 {
  left: 0;
  right: 0;
  height: 300px;
  width: 100%;
  top: 0;
  background: rgb(255, 255, 255);
}

.otherinfo2 {
  left: 0;
  right: 0;
  height: 300px;
  width: 100%;

  top: 0;
  background: rgb(255, 255, 255);
}

.otherinfo3 {
  left: 0;
  right: 0;
  height: 300px;
  width: 100%;
  top: 0;
  background: rgb(255, 255, 255);
}
</style>
