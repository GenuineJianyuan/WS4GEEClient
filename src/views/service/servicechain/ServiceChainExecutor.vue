<template>
  <div class="containers2">
    <div class="canvas2" ref="canvas"></div>
    <panel v-if="bpmnModeler" :modeler="bpmnModeler"></panel>
    <chainSelection v-if="openChainSelection" @setBpmnXml="setBpmnXml"/>
    <div class="command">
      <el-card class="box-card" shadow="hover">
        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="console" name="terminal"></el-tab-pane>
            <el-tab-pane label="output files" name="output"></el-tab-pane>
          </el-tabs>
        </template>
        <div v-if="activeName==='terminal'">
           <textarea v-model="logInfo" class="terminal" maxlength="500"
                     readonly="true"></textarea>
        </div>
        <div v-if="activeName!=='terminal'">
          <template>
            <el-table :data="tableData" style="width: 100%" :height="200">
              <el-table-column prop="id" label="node" width="180"></el-table-column>
              <el-table-column prop="name" label="name" width="180"></el-table-column>
              <el-table-column prop="url" label="URL"></el-table-column>
              <el-table-column prop="operation" label="download">
                <template slot-scope="scope">
                  <el-button size="mini" type="success" icon="el-icon-edit"
                             @click="handleEdit(scope.$index, scope.row)"> download
                  </el-button>
                </template>
              </el-table-column>

            </el-table>
          </template>
        </div>
      </el-card>
    </div>
    <div class="executeBar">
      <el-button @click="chainSelection" title="Select the service chain model from the server"
                 class="selection-button">Chain Selection
      </el-button>
      <!--      <el-button title="Clear the information set in data nodes" @click="reset"  class="selection-button">Reset</el-button>-->
      <el-button title="Upload and execute the service chain" @click="execute" class="selection-button">Execute
      </el-button>
    </div>
  </div>
</template>

<script>
import customTranslate from '../../../utils/bpmnuntils/customTranslate/customTranslate';
import BpmnModeler from 'bpmn-js/lib/Modeler';// bpmn-js 设计器
import panel from "./DataPanel";//右侧属性面板
import BpmData from "../../../utils/bpmnuntils/BpmData";//左侧面板
import customRules from './rules'
import chainSelection from "./ChainSelection";

export default {
  name: "ServiceChainExecutor",
  data() {
    return {
      openChainSelection: false,
      bpmnModeler: null,
      element: null,
      bpmData: new BpmData(),
      processlist: [],
      logInfo: "",
      timer: '',
      runnable: false,
      currentRunningProgressId: "",
      finished: 0,
      activeName: "terminal",
      tableData: []
    }

  },
  components: {
    panel,
    chainSelection
  },
  mounted() {
    const customTranslateModule = {
      translate: ['value', customTranslate]
    };
    const additionalModules = {
      additionalModules: [{zoomScroll: ['value', '']}]
    };
    const labelEditingProvider = {
      labelEditingProvider: ['value', '']
    };
    const customContextPad = {
      contextPadProvider: ['value', '']
    };
    const customPaletteProvider = {
      paletteProvider: ['value', '']
    };
    const canvas = this.$refs.canvas;

    this.bpmnXml = `
    <?xml version="1.0" encoding="UTF-8"?>
     <bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
      <bpmn2:process id="process07F111EC" name="" description="">
        <bpmn2:documentation />
      </bpmn2:process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="process07F111EC" />
      </bpmndi:BPMNDiagram>
     </bpmn2:definitions>
      `;
    // 生成实例
    this.bpmnModeler = new BpmnModeler({
      // 主要容器
      container: canvas,
      additionalModules: [
        customTranslateModule,
        additionalModules,
        customContextPad,
        customRules,
        customPaletteProvider,
        labelEditingProvider
      ],
    });

    this.createNewDiagram() // 新增流程定义
  },
  methods: {
    chainSelection() {
      this.openChainSelection = !this.openChainSelection;
    },
    closeChainSelection() {
      this.openChainSelection = false;
    },

    handleClick() {

    },
    handleEdit(index, row) {
      let url = row.url;
      if (url.indexOf("http://192.168.100.198:80/GSM") !== -1) {
        url = url.replace("http://192.168.100.198:80/GSM", "http://localhost:8080/GSM")
      }
      window.open(url, '_blank')

    },
    createNewDiagram() {
      // 将字符串转换成图显示出来
      try {
        const result = this.bpmnModeler.importXML(this.bpmnXml);
        this.addEventBusListener()
        this.getNodeInfoList()
      } catch (err) {
        console.log(err.message, err.warnings);
      }
    },
    setBpmnXml(bpmn) {
      this.bpmnXml = bpmn;
    },

    // 获取流程图中所有节点信息
    getNodeInfoList() {
      const elementRegistry = this.bpmnModeler.get('elementRegistry')
      const start = elementRegistry.filter(
        (item) => item.type === 'bpmn:StartEvent'
      )
      // start 便是流程图中所有的开始（数据输入）节点的集合
    },

    updateTableData(finishedResult) {
      this.tableData = [];
      let processNodeProgresses = finishedResult.data.processNodeProgresses;
      let outputDataNodeProgresses = finishedResult.data.outputDataNodeProgresses;
      if (processNodeProgresses.length > 0) {
        processNodeProgresses.forEach((processNodeProgress) => {
          if (processNodeProgress.dataOutURL.indexOf("D:/Apache Software Foundation/Tomcat 9.0/webapps/GSM") !== -1) {
            processNodeProgress.dataOutURL = processNodeProgress.dataOutURL.replace("D:/Apache Software Foundation/Tomcat 9.0/webapps/GSM", "http://192.168.100.198:80/GSM")
          }
          this.tableData.push(
            {
              "id": processNodeProgress.nodeId,
              "name": processNodeProgress.nodeName,
              "url": processNodeProgress.dataOutURL,
            })
        })
      }
      if (outputDataNodeProgresses.length > 0) {
        outputDataNodeProgresses.forEach((outputDataNodeProgress) => {
          if (outputDataNodeProgress.dataUrl.indexOf("D:/Apache Software Foundation/Tomcat 9.0/webapps/GSM") !== -1) {
            outputDataNodeProgress.dataUrl = outputDataNodeProgress.dataUrl.replace("D:/Apache Software Foundation/Tomcat 9.0/webapps/GSM", "http://192.168.100.198:80/GSM")
          }
          this.tableData.push(
            {
              "id": "output",
              "name": outputDataNodeProgress.nodeName,
              "url": outputDataNodeProgress.dataUrl,
            })
        })
      }
    },

    // 绑定事件，后面根据需要再补充
    addEventBusListener() {
      const eventBus = this.bpmnModeler.get('eventBus');
      // 注册节点事件，eventTypes中可以写多个事件
      const eventTypes = ['element.click', 'element.hover'];
      eventTypes.forEach((eventType) => {
        eventBus.on(eventType, (e) => {
          const {element} = e
          if (!element.parent) return
          if (!e || element.type === 'bpmn:Process') {
            return false
          } else {
            if (eventType === 'element.click') {
            } else if (eventType === 'element.hover') {
            }
          }
        })
      })

    },

    async execute() {
      const elementRegistry = this.bpmnModeler.get('elementRegistry')
      this.finished = false;

      //验证是否所有数据节点（StartEvent）都已经赋值以及拥有类型
      const start = elementRegistry.filter(
        (item) => item.type === 'bpmn:StartEvent'
      )
      const modeling = this.bpmnModeler.get("modeling");
      let isComplete = true;
      let tempNode = [];
      start.forEach(ele => {
        if (!ele.businessObject.$attrs["ge:nodeOutgoing"]) {
          isComplete = false
          tempNode.push(ele.id)
        } else {
          const nodeOutgoing = JSON.parse(ele.businessObject.$attrs["ge:nodeOutgoing"]);
          if ((!nodeOutgoing) || (!nodeOutgoing[0]["dataFormat"]) || (!nodeOutgoing[0]["inputDataSource"])) {
            isComplete = false
            tempNode.push(ele.id)
          }
        }
      })
      if (!isComplete) {
        alert("数据节点" + tempNode + "未填充完毕！");
        return;
      }

      const result = await this.bpmnModeler.saveXML({format: true});
      const {xml} = result;

      const process = elementRegistry.filter(
        (item) => item.type === 'bpmn:Process'
      )
      let currentTimeMillis = new Date().getTime();
      this.currentRunningProgressId = process[0].id + "_" + currentTimeMillis;


      this.$http({
        method: 'post',
        url: 'api/servicechain/excute',
        data: {
          bpmn: xml,
          currentTimeMillis: currentTimeMillis
        }
      }).then(response => {
        const result = response.data;
        const elementRegistry = this.bpmnModeler.get('elementRegistry')
        if (result.code === 0) {
          this.logInfo = this.logInfo + JSON.stringify(result) + "\n";
          elementRegistry.forEach(e => {
            if (e.businessObject.$type === "bpmn:StartEvent" || e.businessObject.$type === "bpmn:IntermediateThrowEvent") {
              modeling.setColor(e, {
                fill: "#CCFFCC",
                stroke: "black"
              });
            }
          });
        }
      });

      await sleep(2000);
      let that = this;
      do {
        that.$http({
          method: 'get',
          url: 'api/servicechain/getchainprogress/' + that.currentRunningProgressId
        }).then(async response => {
          let result = response.data;
          if (result.code === 0) {
            let finishedNodes = result.data.finishedProcessNode;
            let currentNode = result.data.currentProcessNode;
            let progress = result.data.progress;
            that.finished = result.data.finished;
            let task = elementRegistry.filter(
              (item) => item.type === 'bpmn:Task'
            )
            let end = elementRegistry.filter(
              (item) => item.type === 'bpmn:EndEvent'
            )
            if (that.finished === 0) {
              if (finishedNodes != null) {
                task.forEach(ele => {
                  if (finishedNodes.indexOf(ele.id) > -1) {
                    modeling.setColor(ele, {fill: "none", stroke: "green"});
                  }
                });
              }
              progress = progress.substring(2, progress.length - 2)
              let progressList = progress.split("}, {");
              that.logInfo = "";
              for (let i = 0; i < progressList.length; i++) {
                that.logInfo = that.logInfo + progressList[i] + "\n";
              }
              if (currentNode != null) {
                for (const ele of task) {
                  if (ele.id === currentNode) {
                    for (let i = 0; i < 2; i++) {
                      modeling.setColor(ele, {fill: "#43b23b", stroke: "black"});
                      await sleep(900);
                      modeling.setColor(ele, {fill: "#ff0000", stroke: "black"});
                      await sleep(900);
                    }
                  }
                }
              }

              that.$http({
                method: 'get',
                url: 'api/servicechain/getchainprogress/finished/' + that.currentRunningProgressId
              }).then(async response => {
                //获取输出数据
                let finishedResult = response.data;
                console.log(finishedResult);
                that.updateTableData(finishedResult);
              });
            }
            if (that.finished === 1) {
              task.forEach(ele => {
                modeling.setColor(ele, {fill: "none", stroke: "green"});
              });
              end.forEach(ele => {
                modeling.setColor(ele, {fill: "none", stroke: "green"});
              });
              progress = progress.substring(2, progress.length - 2)
              let progressList = progress.split("}, {");
              that.logInfo = "";
              for (let i = 0; i < progressList.length; i++) {
                that.logInfo = that.logInfo + progressList[i] + "\n";
              }
              console.log(progressList.toString())
              that.$http({
                method: 'get',
                url: 'api/servicechain/getchainprogress/finished/' + that.currentRunningProgressId
              }).then(async response => {
                //获取输出数据
                let finishedResult = response.data;
                console.log(finishedResult);
                that.updateTableData(finishedResult);
              });
            }
            if (that.finished === -1) {
              for (const ele of task) {
                if (ele.id === currentNode) {
                  modeling.setColor(ele, {fill: "#ad0404", stroke: "black"});
                }
                let progressList = progress.split("}, {");
                that.logInfo = "";
                for (let i = 0; i < progressList.length; i++) {
                  that.logInfo = that.logInfo + progressList[i] + "\n";
                }
              }
              console.log(progressList.toString())
              that.$http({
                method: 'get',
                url: 'api/servicechain/getchainprogress/finished/' + that.currentRunningProgressId
              }).then(async response => {
                //获取输出数据
                let finishedResult = response.data;
                console.log(finishedResult);
                that.updateTableData(finishedResult);
              });
            }
          }
        });
        await sleep(4000);
      } while (that.finished === 0)

      await sleep(2000);

      function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
      }
    },
  }
}
</script>

<style lang="scss">
.containers2 {
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  width: 100%;
  height: 94.4%;

  .canvas2 {
    position: absolute;
    width: calc(100% - 300px);
    height: 70%;
    background-color: #ffffff;
  }

  .command {
    position: absolute;
    bottom: 0;
    height: 30%;
    background-color: #efe9db;
    width: calc(100% - 300px);

    .el-card {
      height: 100%;

      .el-table {
        th {
          padding: 1px;
        }

        td {
          padding: 1px;
        }
      }
    }
  }

  .bjs-powered-by {
    display: none;
  }

  .panel {
    position: absolute;
    right: 0;
    width: 300px;
  }

  .processBar2 {
    position: absolute;
    top: 20px;
    left: 60px;
  }

  .executeBar {
    position: absolute;
    top: 20px;
    right: 350px;

    a {
      text-decoration: none;
      margin: 5px;
      color: #409eff;
    }
  }

  .terminal {
    resize: none;
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
    margin: 0 auto;
    font-size: 15px;
    outline: none;
    border-radius: 5px;
    padding: 10px;
    background-color: #efe9db;
    word-break: break-all;
    min-height: 180px;
  }

  .selection-button {
    background-color: #409eff;
    color: #ffffff;
    border: 1px solid #9696b4
  }

}

</style>
