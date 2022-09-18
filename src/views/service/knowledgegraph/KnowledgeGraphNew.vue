<template>
  <div id="knowledgeGraphNew">
    <div
      style="height:110px;padding-top:6px;padding-left: 30px;padding-right:30px;border-bottom: #efefef solid 1px;color: #555555;font-size: 12px;">
      <div style="">
        <div style="line-height: 20px;">节点筛选：</div>
        <el-radio-group v-model="checked_servicetype" size="mini" @change="doFilter">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="WFS"></el-radio-button>
          <el-radio-button label="WPS"></el-radio-button>
        </el-radio-group>
      </div>
      <div>
        <div style="line-height: 20px;">关系筛选：</div>
        <el-checkbox-group v-model="rel_checkList" @change="doFilter">
          <el-checkbox v-for="thisItem in all_rel_type" :key="thisItem" :label="thisItem"/>
        </el-checkbox-group>
      </div>
    </div>
    <div style="margin-top:0px;width: calc(100% - 10px);height:calc(100vh - 170px);"
         @click="isShowNodeMenuPanel = false" ref="myPage">
      <SeeksRelationGraph
        ref="seeksRelationGraph"
        :options="graphOptions">
        <div style="cursor: pointer;" slot="node" slot-scope="{node}" @click="showNodeMenus(node, $event)" @contextmenu.prevent.stop="showNodeMenus(node, $event)">
          <div style="height:22px;line-height: 64px;border-radius: 32px;">
          </div>
          <div>
            {{ node.text}}
          </div>
          <div style="height:22px;line-height: 64px;border-radius: 32px;">
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
        __graph_json_data:{},
        g_loading: true,
        demoname: '---',
        currentNode: null,
        text1: '',
        text2: '',
        text3: '',
        serviceUrl: '',
        isShowNodeMenuPanel: false,
        nodeMenuPanelPosition: {x: 0, y: 0},
        checked_servicetype: '',
        checked_isgoodman: '',
        rel_checkList: ['输入', '前驱匹配', '后驱匹配', '完全匹配'],
        all_rel_type: ['输入', '前驱匹配', '后驱匹配', '完全匹配'],
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
      initGraphData(){
        let that = this;
        this.$http.get('../../../../static/json/data.json').then((response) => {
          that.__graph_json_data = response.data;
          console.log("root:"+data);
          that.setGraphData()
        }).catch(function (error) {
          console.log(error)
        });

      },
      setGraphData() {
        this.$refs.seeksRelationGraph.setJsonData(this.__graph_json_data, (seeksRGGraph) => {
          // 这些写上当图谱初始化完成后需要执行的代码
        })
      },
      doFilter() {
        var _all_nodes = this.$refs.seeksRelationGraph.getNodes();
        var _all_lines = this.$refs.seeksRelationGraph.getLines();
        _all_nodes.forEach(thisNode => {
          var _isHideThisLine = false;
          if (this.checked_servicetype !== '') {
            if (thisNode.data['serviceType'] !== this.checked_servicetype) {
              _isHideThisLine = true
            }
          }
          thisNode.opacity = _isHideThisLine ? 0.1 : 1
        });
        _all_lines.forEach(thisLine => {
          // 注意这里的line和json数据中link不一样，一条线（line）上可以附着多条关系(link),可以通过line.relations获取到这条线上所有的关系数据(link)
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
          this.text2 =""
          this.text3 =""
        } else {
          this.text1 = "操作1：请求地址：192.168.100.121:8080/"+this.currentNode.text+"/operation-1";
          this.text2 = "操作2：请求地址：192.168.100.121:8080/"+this.currentNode.text+"/operation-2";
          this.text3 = "操作3：请求地址：192.168.100.121:8080/"+this.currentNode.text+"/operation-3";
        }

      },
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
