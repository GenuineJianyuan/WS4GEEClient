<template>
  <div id="frame">
    <div id="section1">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="WPS" name="first">网络处理服务（WPS - Web Processing Service）</el-tab-pane>
        <el-tab-pane label="SOAP" name="second">SOAP处理服务</el-tab-pane>
        <el-tab-pane label="RESTFUL" name="third">RESTFUL处理服务</el-tab-pane>
        <el-tab-pane label="其它处理服务" name="fourth">其它处理服务</el-tab-pane>
      </el-tabs>
    </div>
    <div id="section2">
      <el-table :data="tableData" :height="height" id="tableData">
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>
    </div>
    <div id="section3">
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50]"
        :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        background id="pagination">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProcessingResource",
  data() {
    return {
      activeName: "first",
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,

      height: "200px"
    }
  },
  mounted() {


    this.getAutoHeight("#tableData");
    // this.getAutoHeight("#pagination")
    const self = this;
    window.onresize = function () {

      // self.getAutoHeight("#pagination")
      self.getAutoHeight("#tableData");
    };
  },
  methods: {
    getAutoHeight(elementId) {
      let el = document.querySelector(elementId);
      if (!el.parentNode) return;
      let elParent = el.parentNode,
        pt = this.getStyle(elParent, "paddingTop"),
        pb = this.getStyle(elParent, "paddingBottom");
      // 一定要使用 nextTick 来改变height 不然不会起作用
      this.$nextTick(() => {
        this.height = elParent.clientHeight - (pt + pb) + "px";
      });
    },
    // 获取样式 我们需要减掉 padding-top， padding-bottom的值
    getStyle(obj, attr) {
      // 兼容IE浏览器
      let result = obj.currentStyle
        ? obj.currentStyle[attr].replace("px", "")
        : document.defaultView
          .getComputedStyle(obj, null)[attr].replace("px", "");
      return Number(result);
    }
  }
}
</script>

<style scoped lang="stylus">


#frame {
  position absolute
  top 70px
  left 30px
  right 30px
  bottom 30px
  overflow hidden
  background white

  #section1 {
    height 10%
    margin 20px
    .el-tabs {
      position fixed
    }
  }

  #section2 {
    height 75%
  }

  #section3 {
    height 15%
    //background #c2e7b0
    text-align center
    margin 20px
  }
}

</style>
