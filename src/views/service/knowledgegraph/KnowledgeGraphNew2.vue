<template>
  <div id="knowledgeGraphNew">
    <div
      style="height:110px;padding-top:6px;padding-left: 30px;padding-right:30px;border-bottom: #efefef solid 1px;color: #555555;font-size: 12px;">
      <el-row>
        <el-col :span="18">

          <div style="">
            <!--        <div style="line-height: 20px;">节点筛选：</div>-->
            <div style="line-height: 20px;">Node Selection:</div>
            <el-radio-group v-model="checked_servicetype" size="mini" @change="doFilter">
              <el-radio-button label="">All</el-radio-button>
              <!--          <el-radio-button label="">全部</el-radio-button>-->
              <el-radio-button label="Geospatial Data Service"></el-radio-button>
              <el-radio-button label="Geoprocessing Service"></el-radio-button>
            </el-radio-group>
          </div>
          <div>
            <div style="line-height: 20px;">Relation Selection:</div>
            <!--        <div style="line-height: 20px;">关系筛选：</div>-->
            <el-checkbox-group v-model="rel_checkList" @change="doFilter">
              <el-checkbox v-for="thisItem in all_rel_type" :key="thisItem" :label="thisItem"/>
            </el-checkbox-group>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="">
            <el-form :inline="true">
              <el-form-item label="Node Search">
                <el-select v-model="startNode" placeholder="请选择"  filterable size="mini" @change="(value) => nodeSelected(value)">
                  <el-option
                    v-for="item in nodeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>

            </el-form>
            <!--        <div style="line-height: 20px;">节点筛选：</div>-->
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top:0px;width: calc(100% - 10px);height:calc(100vh - 170px);"
         @click="isShowNodeMenuPanel = false" ref="myPage">
      <SeeksRelationGraph
        ref="seeksRelationGraph"
        :options="graphOptions">
        <div slot="node" slot-scope="{node}">
          <div style="height:22px;line-height: 64px;border-radius: 32px;cursor: pointer;"
               @click="showNodeMenus(node, $event)" @contextmenu.prevent.stop="showNodeMenus(node, $event)">
            <i style="font-size: 30px;"/>
          </div>
          <div>
            {{ node.text }}
          </div>
        </div>
      </SeeksRelationGraph>
    </div>

    <div v-show="isShowNodeMenuPanel"
         :style="{left: nodeMenuPanelPosition.x + 'px', top: nodeMenuPanelPosition.y + 'px' }"
         style="z-index: 999;padding:10px;background-color: #ffffff;border:#eeeeee solid 1px;box-shadow: 0px 0px 8px #cccccc;position: absolute;">
      <div style="line-height: 25px;padding-left: 10px;color: #888888;font-size: 12px;">服务信息：</div>
      <div style="line-height: 25px;padding-left: 10px;color: #888888;font-size: 12px;" v-text=text1></div>
      <div style="line-height: 25px;padding-left: 10px;color: #888888;font-size: 12px;" v-text=text2></div>
      <div style="line-height: 25px;padding-left: 10px;color: #888888;font-size: 12px;" v-text=text3></div>
    </div>
  </div>
</template>

<script>
import SeeksRelationGraph from 'relation-graph'
import data from '../../../../static/json/data'

export default {
  name: 'SeeksRelationGraphDemo',
  components: {SeeksRelationGraph},
  data() {
    return {
      __graph_json_data: {nodes: [], links: [], rootId: "a"},
      g_loading: true,
      demoname: '---',
      currentNode: null,
      startNode:"buffer",
      nodeList:[],
      text1: '',
      text2: '',
      text3: '',
      serviceUrl: '',
      isShowNodeMenuPanel: false,
      nodeMenuPanelPosition: {x: 0, y: 0},
      checked_servicetype: '',
      checked_isgoodman: '',
      // rel_checkList: ['输入', '前驱匹配', '后驱匹配', '完全匹配', '交叉匹配', '自我匹配'],
      // all_rel_type: ['输入', '前驱匹配', '后驱匹配', '完全匹配', '交叉匹配', '自我匹配'],
      rel_checkList: ['input', 'pre-contain', 'sub-contain', 'full-match', 'cross-match', 'self-match'],
      all_rel_type: ['input', 'pre-contain', 'sub-contain', 'full-match', 'cross-match', 'self-match'],

      graphOptions: {
        defaultNodeBorderWidth: 0,
        defaultNodeColor: 'rgba(238, 178, 94, 1)',
        allowSwitchLineShape: true,
        allowSwitchJunctionPoint: true,
        defaultLineShape: 1,
        'layouts': [
          {
            'label': 'force',
            'layoutName': 'force',
            'layoutClassName': 'seeks-layout-force'
          }
        ],
        defaultJunctionPoint: 'border'
        // 这里可以参考"Graph 图谱"中的参数进行设置
      }
    }
  },
  created() {
  },
  mounted() {
    this.demoname = this.$route.params.demoname;
    this.initGraphData();
  },
  methods: {
    initGraphData() {
      this.initNodeList()
      this.setGraphByStartNode('buffer')
    },
    initNodeList(){
      this.$http({
        method: 'get',
        url: 'api/knowledgegraph/all/abstract/service',
      }).then(response => {
        const result = (response.data)
        if (result.code === 0) {
          let serviceList = result.data;
          this.abstractServiceList = [];
          serviceList.forEach(element => {
            this.nodeList.push({label: element.label, value: element.value})
          })
        }
      }).catch(function (error) { // 请求失败处理
        console.log(error);
      });
    },
    setGraphData() {
      this.$refs.seeksRelationGraph.setJsonData(this.__graph_json_data, (seeksRGGraph) => {
        // 这些写上当图谱初始化完成后需要执行的代码
      })
    },
    setGraphByStartNode(nodeName){
      let that = this;
      this.$http.get('http://localhost:8888/knowledgegraph/abstractservice/identifier?identifier='+nodeName+'&count=30').then((response) => {
        // this.$http.get('../../../../static/json/data.json').then((response) => {
        that.__graph_json_data = response.data.data;
        // console.log("root:" + data);

        let temp = response.data.data;
        let tempLinks = temp.links
        let tempNodes = temp.nodes
        this.__graph_json_data.links = []
        this.__graph_json_data.nodes = []

        for (let i = 0; i < tempLinks.length; i++) {
          let currentLink = tempLinks[i]
          this.__graph_json_data.links.push(currentLink)
        }

        for (let i = 0; i < tempNodes.length; i++) {
          let currentNode = tempNodes[i]
          if (currentNode.data.serviceType === 'WFS')
            continue;
          if (i === 0) {
            currentNode.color = 'green'
            // this.__graph_json_data.nodes.push(newNode)
            // this.__graph_json_data.nodes.push(newNode2)
            // this.__graph_json_data.links.push(newLink)
            // this.__graph_json_data.links.push(newLink2)
          }
          this.__graph_json_data.nodes.push(currentNode)
        }
        that.setGraphData()
      }).catch(function (error) {
        console.log(error)
      });
    },
    doFilter() {
      var _all_nodes = this.$refs.seeksRelationGraph.getNodes();
      var _all_lines = this.$refs.seeksRelationGraph.getLines();
      _all_nodes.forEach(thisNode => {
        var _isHideThisLine = false;
        // 抽象类型不对，现在的还是WPS 2021/12/3
        let tempType=""
        if (this.checked_servicetype==='Geoprocessing Service')
          tempType="WPS"
        else if (this.checked_servicetype==='Geospatial Data Service')
          tempType="Parameter"
        if (tempType !== '') {
          console.log(thisNode.data['serviceType'],tempType)
          if (thisNode.data['serviceType'] !== tempType) {
            _isHideThisLine = true
          }
        }
        thisNode.opacity = _isHideThisLine ? 0.1 : 1
      });
      _all_lines.forEach(thisLine => {
        // 注意这里的line和json数据中link不一样，一条线（line）上可以附着多条关系(link),可以通过line.relations获取到这条线上所有的关系数据(link)
        // console.log(thisLine)
        var _isHideThisLine = true;
        thisLine.relations.forEach(thisLink => {
          if (this.rel_checkList.indexOf(thisLink.data['type']) === -1) {
            thisLink.isHide = true
          } else {
            _isHideThisLine = false;
            thisLink.isHide = false;
          }
        })
        // thisNode.opacity = _isShowThisNode ? 1 : 0.1
      })
    },
    showNodeMenus(nodeObject, $event) {
      this.currentNode = nodeObject;
      var _base_position = this.$refs.myPage.getBoundingClientRect();
      console.log('showNodeMenus:', $event, _base_position);
      this.isShowNodeMenuPanel = true;
      this.nodeMenuPanelPosition.x = $event.clientX - _base_position.x;
      this.nodeMenuPanelPosition.y = $event.clientY - _base_position.y;
      if (this.currentNode.data.serviceType === "WFS") {
        this.text1 = "WFS服务地址：" + this.currentNode.data.serviceUrl
        this.text2 = ""
        this.text3 = ""
      } else {
        this.text1 = "操作1：请求地址：192.168.100.121:8080/" + this.currentNode.text + "/operation-1";
        this.text2 = "操作2：请求地址：192.168.100.121:8080/" + this.currentNode.text + "/operation-2";
        this.text3 = "操作3：请求地址：192.168.100.121:8080/" + this.currentNode.text + "/operation-3";
      }

    },
    nodeSelected(){
      let nodeName=""
      for (let i=0;i<this.nodeList.length;i++){
        if (this.nodeList[i].value===this.startNode){
          nodeName=this.nodeList[i].label
          break;
        }
      }
      this.setGraphByStartNode(nodeName)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#knowledgeGraphNew {
  position: absolute;
  padding-top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%
}

.c-my-node {
  background-position: center center;
  background-size: 100%;
  border: #ff8c00 solid 2px;
  height: 80px;
  width: 80px;
  border-radius: 40px;
}

.c-node-name {
  width: 160px;
  margin-left: -40px;
  text-align: center;
  margin-top: 85px;
}
</style>
