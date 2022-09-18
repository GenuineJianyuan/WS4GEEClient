<template>
  <div class="chain-selection" ref="chainSelection">
    <div style="height: 70px; width: 100%; padding-top: 15px;padding-left: 30px;padding-right: 30px;">
      <el-input v-model="searchKeyWords" placeholder="Input key words of NAME or DESCRIPTION to search service chain"
                style="width: 80%"></el-input>
      <el-button @click="chainSearch()" id="chain-search"
                 style="float: right; width: 120px" class="selection-button">Search
      </el-button>
    </div>
    <div style="height:380px; width: 100%;padding-left: 30px;padding-right: 30px;">
      <div
        style="height: 380px; width: 300px;background-color: #f9f9f9;border: 1px solid #919191;  border-radius: 4px; float: left">
        <vue-custom-scrollbar class="scroll-area" :settings="scrollSettings">
          <el-radio-group v-model="chainSelected" v-for="item in chainList" class="x-fillitem el-group-list"
                          @change="chainSelecting(item)">
            <el-radio-button :key="item.value"
                             :value="item.value"
                             :title="item.description"
                             :label="item.label">{{ item.label }}
            </el-radio-button>
          </el-radio-group>
          <div v-if="chainList.length===0" style="width: 100%; text-align: center">no results</div>
        </vue-custom-scrollbar>
      </div>
      <div
        style="height: 380px; width: 440px; background-color: #f9f9f9; border: 1px solid #919191; border-radius: 4px; float: right">
        <img :src="chainInfo.chainSvg" class="chain-Svg" :title="chainInfoSelected.label">
        <textarea v-model="chainInfoSelected.description" class="chainSelected-description" readonly="true"></textarea>
      </div>
    </div>
    <div style="height: 54px; width: 100%; padding: 7px 30px;">
      <el-button @click="selectionLoad()" :disabled="chainInfoSelected.bpmn===null" id="chain-load" style="float: right; margin-left: 20px; width: 120px"
                 class="selection-button">Load
      </el-button>
      <el-button @click="selectionCancel()" id="chain-cancel" style="float: right; width: 120px"
                 class="selection-button">Cancel
      </el-button>
    </div>
  </div>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar'
import "vue-custom-scrollbar/dist/vueScrollbar.css"

export default {
  name: "ChainChoosingTable",
  components: {
    vueCustomScrollbar
  },
  data() {
    return {
      chainInfo: {
        chainSvg: null,
        motto: 'xxxxxxxxxx'
      },
      searchKeyWords: "",
      chainSelected: null,
      chainInfoSelected: {
        value: "",
        label: "",
        svg: "",
        bpmn:null,
        description: ""
      },
      chainList: [],
      scrollSettings: {
        suppressScrollY: false,
        suppressScrollX: false,
        wheelPropagation: false
      },
    };

  },
  mounted() {
    this.initServiceList();
  },
  methods: {
    initServiceList() {
      this.$http({
        method: 'get',
        url: 'api/servicechain/getall/chaininfo',
      }).then(response => {
        const result = (response.data)
        if (result.success === true) {
          this.chainList = [];
          result.data.forEach(element => {
            this.chainList.push({
              value: element.processId,
              label: element.processName,
              description: element.processDescription,
              bpmn: element.bpmn,
              svg: element.svg
            })
          })
        }
      })
    },
    chainSelecting(item) {
      this.chainInfoSelected = item;
      let svgString = this.chainInfoSelected.svg;
      this.chainInfo.chainSvg = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgString)))
    },
    chainSearch() {
      let searchUrl = "";
      if (this.searchKeyWords.trim() === "") {
        searchUrl = 'api/servicechain/getall/chaininfo';
      } else {
        searchUrl = 'api/servicechain/getbykeywords/chaininfo/' + this.searchKeyWords.trim();
      }
      this.$http({
        method: 'get',
        url: searchUrl,
      }).then(response => {
        const result = (response.data)
        if (result.success === true) {
          this.chainList = [];
          result.data.forEach(element => {
            this.chainList.push({
              value: element.processId,
              label: element.processName,
              description: element.processDescription,
              bpmn: element.bpmn,
              svg: element.svg
            })
          })
        }
      })
    },
    selectionLoad() {
      this.$emit('setBpmnXml', this.chainInfoSelected.bpmn);
      this.$parent.createNewDiagram();
      this.$parent.closeChainSelection();
    },
    selectionCancel() {
      this.$parent.closeChainSelection();
    }
  }
}
</script>

<style scoped>
.chain-selection {
  width: 804px;
  height: 504px;
  background-color: #f6f6f6;
  border: 1px solid #000000;
  border-radius: 4px;
  position: absolute;
  left: 40%;
  top: 50%;
  margin-left: -402px;
  margin-top: -252px;
  z-index: 9
}

.chain-Svg {
  width: 100%;
  height: 320px;
  text-align: center;
  border-radius: 4px 4px 0 0;
}

.chainSelected-description {
  resize: none;
  display: block;
  width: 100%;
  height: 54px;
  border-top: 1px solid #5e5e5e;
  border-radius: 0 0 4px 4px;
  font-size: 10px;
  outline: none;
  padding: 10px;
  background-color: #e6e6e6;
  word-break: break-all;
}

.el-group-list.el-radio-group {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.el-group-list.el-radio-group {
  border: 1px solid #cccfd3;
}

/deep/ .el-group-list.el-radio-group .el-radio-button:first-child .el-radio-button__inner,
/deep/ .el-group-list.el-radio-group .el-radio-button:last-child .el-radio-button__inner,
/deep/ .el-group-list.el-radio-group .el-radio-button:first-child .el-radio-button__inner,
/deep/ .el-group-list.el-radio-group .el-radio-button__inner {
  border-radius: 4px !important;
  border: 2px !important;
  width: 296px !important;
  text-align: left;
  font-size: 12px;
}

.el-group-list.el-radio-group .el-radio-button {
  border-bottom: 2px solid #cccfd3 !important;
  border-radius: 4px !important;
}


.el-group-list.el-radio-group > label > span {
  width: 100%;
  text-align: left;
  padding-left: 20px;
}

.scroll-area {
  position: relative;
  margin: auto;
  width: 298px;
  height: 378px;
  border-radius: 4px;
}

.selection-button {
  background-color: #409eff;
  color: #ffffff;
  border: 1px solid #9696b4
}
</style>
