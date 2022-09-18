<template>
  <el-card class="box-card" shadow="always" id="visualizationForm">
    <el-form ref="form" :model="form" label-width="110px">
      <el-row :gutter="5">
        <el-col :span="21">
          <el-form-item label="URL:" label-width="50px">
            <el-input placeholder="http://" v-model="url" clearable size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item style="margin-left: -100px">
            <el-button size="small" icon="el-icon-search" circle></el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item style="margin-left: -100px">
        <div class="imageFrame">
          <el-image :src="img_default" fit="fill"></el-image>
        </div>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item style="margin-left: -100px">
        <el-button type="primary" size="small">Configuration</el-button>
        <el-button type="primary" size="small">Toolbox</el-button>
        <el-button type="primary" size="small">Back</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
// import img_default from '@/assets/default.jpg';
export default {
  name: "Visualization",
  data() {
    return {
      img_default: require('@/assets/default.jpg'),
      form: {},
      src: "require('../assets/default.jpg')",
      url: ""
    }
  },
  methods: {}
}
</script>

<style scoped>
#visualizationForm {
  width: 520px;
  color: #2c3e50;
  margin-top: 60px;
  margin-left: 500px;
  margin-right: 100px;
  /*border-style: solid;*/
  /*border-width: 1px;*/
  /*border-color: #000;*/
}

.el-form-item {
  margin-bottom: 5px;
}

.el-divider {
  margin: 5px;
  margin-top: 15px;
}


</style>
