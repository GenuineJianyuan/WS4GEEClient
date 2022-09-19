<template>
  <div class="home-container">
    <el-header class="header">
      <div class="logo">Welcome to WS4GEE Client System</div>
    </el-header>
    <el-carousel indicator-position="outside">
      <el-carousel-item v-for="item in this.service" :key="item" style="text-align: center"
                        @click.native="carouselClick(item)">
        <h1>{{ item }}</h1>
      </el-carousel-item>
    </el-carousel>

    <el-row class="box-otherinfo" gutter=10>
      <el-col :xs="24" :sm="24" :lg="8">
        <div id="otherinfo1" class="otherinfo1" style="text-align: center;">
          <svg-icon style="width: 50px; height: 50px; margin-top: 50px" iconClass="dizhi"/>
          <div style="wmargin-bottom: 5px; line-height: 35px;font-size: 16px">Address</div>
          <div style="wmargin-bottom: 5px; line-height: 35px;font-size: 16px">China · 129 Luoyu Street</div>
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
      service: ["Service Registration", "Resource Preview", "Process Client", "Tutorial"]
    };
  },
  methods: {
    carouselClick(value) {
      console.log(value)
      let path=""
      if (value=='Service Registration'){
        path='/registration'
      }else if (value=='Resource Preview'){
        path='/search'
      }else if (value=='Process Client'){
        path='/process'
      }else if (value=='Tutorial'){
        path='/tutorial'
      }
      this.$router.push({
        path: path
      })
    }

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
  width: 600px;
  margin-left: -200px;
  line-height: 50px;
}


.el-menu :hover {
  background-color: #304156 !important;
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

.el-carousel__item {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
