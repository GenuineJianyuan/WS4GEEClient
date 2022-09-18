<template>
  <div class="containers">
    <div ref="palette"></div>
    <div class="canvas" ref="canvas"></div>
    <chainSelection v-if="openChainSelection" @setBpmnXml="setBpmnXml"/>
    <panel ref="dataPanel" v-if="bpmnModeler" :modeler="bpmnModeler"/>
    <div class="toolbar">
      <el-button @click="chainSelection" title="Select the service chain model from the server"
                 class="selection-button">Chain Selection
      </el-button>
      <el-button @click="saveXML" title="Download the BPMN file of the service chain shown below"
                 class="selection-button">Export Process
      </el-button>
      <el-button @click="$refs.refFile.click()" title="Upload and display the BPMN file" class="selection-button">Import
        Process
      </el-button>
      <el-button @click="saveSVG" title="Download the SVG file of the service chain shown below"
                 class="selection-button">Save as SVG
      </el-button>
      <!--      <el-button @click="handleUndo" title="Undo the previous step" class="selection-button">Undo</el-button>-->
      <!--      <el-button @click="handleRedo" title="Redo the previous step" class="selection-button">Redu</el-button>-->
      <el-button @click="submit" title="Save the service chain shown below to the server" class="selection-button">
        Submit Process
      </el-button>
      <input type="file"
             id="files"
             ref="refFile"
             style="display: none"
             @change="loadXML"/>
    </div>
  </div>
</template>

<script>
import customTranslate from '../../../utils/bpmnuntils/customTranslate/customTranslate';
import BpmnModeler from 'bpmn-js/lib/Modeler';// bpmn-js 设计器
import panel from "./PropertyPanel";//右侧属性面板
import chainSelection from "./ChainSelection";//右侧属性面板
import BpmData from "../../../utils/bpmnuntils/BpmData";//左侧面板
import customContextPad from './contextPad'
import customRules from './rules'
//以下为bpmn样式
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
//extension
import Extension from '../../../../static/json/extension.json'
import {uuid} from "../../../api/commonapi";
import axios from "axios";
import {Notification} from "element-ui";

export default {
  name: "ServiceChainBuilder",
  data() {
    return {
      openChainSelection: false,
      bpmnModeler: null,
      element: null,
      bpmData: new BpmData(),
      bpmnXml: '',
      processlist: [],
      timer: '',
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
      keyboard: {
        bindTo: document
      },
      moddleExtensions: {
        ge: Extension
      },
      additionalModules: [
        customTranslateModule,
        additionalModules,
        customContextPad,
        customRules
      ],
    });

    this.createNewDiagram()
  },
  methods: {
    createNewDiagram() {
      // 将字符串转换成图显示出来
      try {
        const result = this.bpmnModeler.importXML(this.bpmnXml);
        this.adjustPalette();
        this.addEventBusListener();
        this.getNodeInfoList();
      } catch (err) {
        console.log(err.message, err.warnings);
      }
    },
    setBpmnXml(bpmn) {
      this.bpmnXml = bpmn;
    },

    // 调整左侧工具栏排版
    adjustPalette() {
      try {
        // 获取 bpmn 设计器实例
        const canvas = this.$refs.canvas;
        const djsPalette = canvas.children[0].children[1].children[4];
        const djsPalStyle = {
          width: "220px",
          padding: "5px",
          background: "white",
          left: "20px",
          borderRadius: "4px",
          border: "1px solid #000000"
        };
        for (var key in djsPalStyle) {
          djsPalette.style[key] = djsPalStyle[key];
        }
        const palette = djsPalette.children[0];
        const allGroups = palette.children;
        const subprocess = allGroups[3].children[1];//子流程组件
        //1:起始点中间点结束点 2
        allGroups[0].style["display"] = "none";
        allGroups[2].style["display"] = "none";//网关
        allGroups[4].style["display"] = "none";
        allGroups[5].style["display"] = "none";
        allGroups[6].style["display"] = "none";
        allGroups[7].style["display"] = "none";
        // 修改控件样式
        for (let gKey in allGroups) {
          const group = allGroups[gKey];
          for (let cKey in group.children) {
            const control = group.children[cKey];
            const controlStyle = {
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              padding: "5px"
            };
            if (
              control.className &&
              control.dataset &&
              control.className.indexOf("entry") !== -1
            ) {
              const controlProps = this.bpmData.getControl(
                control.dataset.action
              );
              control.innerHTML = `<div style='font-size: 14px;font-weight:500;margin-left:15px; border-radius: 4px'>${
                controlProps["title"]
              }</div>`;
              for (var csKey in controlStyle) {
                control.style[csKey] = controlStyle[csKey];
              }
            }
          }
          subprocess.style["display"] = "none";
        }
      } catch (e) {
        // console.log(e);
      }
    },

    // 保存文件
    async saveXML() {
      this.setUserDefinedProp()
      try {
        const result = await this.bpmnModeler.saveXML({format: true});
        const {xml} = result;

        const xmlBlob = new Blob([xml], {
          type: 'application/bpmn20-xml;charset=UTF-8,'
        });

        const downloadLink = document.createElement('a');
        downloadLink.download = `bpmn-${+new Date()}.bpmn`;
        downloadLink.innerHTML = 'Get BPMN SVG';
        downloadLink.href = window.URL.createObjectURL(xmlBlob);
        downloadLink.onclick = function (event) {
          document.body.removeChild(event.target)
        };
        downloadLink.style.visibility = 'hidden';
        document.body.appendChild(downloadLink);
        downloadLink.click()
      } catch (err) {
        console.log(err)
      }
    },

    // 保存图片
    async saveSVG() {
      try {
        const result = await this.bpmnModeler.saveSVG();
        const {svg} = result;

        const svgBlob = new Blob([svg], {
          type: 'image/svg+xml'
        });

        const downloadLink = document.createElement('a');
        downloadLink.download = `bpmn-${+new Date()}.SVG`;//暂时根据时间命名
        downloadLink.innerHTML = 'Get BPMN SVG';
        downloadLink.href = window.URL.createObjectURL(svgBlob);
        downloadLink.onclick = function (event) {
          document.body.removeChild(event.target)
        };
        downloadLink.style.visibility = 'hidden';
        document.body.appendChild(downloadLink);
        downloadLink.click()
      } catch (err) {
        console.log(err)
      }
    },

    // 保存加载文件
    async loadXML() {
      const that = this;
      const file = this.$refs.refFile.files[0];
      if (!file) {
        this.$message.error("请选择文件");
        return;
      }
      let pos = file.name.lastIndexOf(".");
      let lastName = file.name.substring(pos, file.name.length);
      if (lastName.toLowerCase() !== ".bpmn") {
        this.$message.error("文件必须为.bpmn 类型");
        return;
      }
      const reader = new FileReader()
      reader.readAsText(file);
      reader.onload = function () {
        that.bpmnXml = this.result;
        that.createNewDiagram()
      }
    },

    async submit() {
      //更改整个process的id
      const elementRegistry = this.bpmnModeler.get('elementRegistry')
      const start = elementRegistry.filter(
        (item) => item.type === 'bpmn:Process'
      )
      const ele = start[0]
      const modeling = this.bpmnModeler.get("modeling");
      modeling.updateProperties(ele, {id: "process" + uuid()})

      //修改每个节点的属性
      this.setUserDefinedProp()
      const bpmnResult = await this.bpmnModeler.saveXML({format: true});
      const {xml} = bpmnResult;
      const svgResult = await this.bpmnModeler.saveSVG();
      const {svg} = svgResult;
      const serviceChainInfo = {
        bpmn: xml,
        svg: svg
      }
      axios.post('api/servicechain/upload',
        serviceChainInfo
      ).then(response => {
        console.log(response)
        if (response.data.success === true) {
          Notification({
            title: "通知",
            message: "上传成功"
          })
        }else {
          Notification({
            title: "通知",
            message: "上传失败:" + "\n" + response.data.message
          })
        }
      }).catch(function (error) { // 请求失败处理
        console.log(error);
        Notification({
          title: "通知",
          message: "上传失败:" + "\n" + error
        })
      });
    },

    // 撤销
    handleUndo() {
      this.bpmnModeler.get('commandStack').undo()
    },

    // 重做
    handleRedo() {
      this.bpmnModeler.get('commandStack').redo()
    },

    setUserDefinedProp() {
      const elementRegistry = this.bpmnModeler.get('elementRegistry')
      const elementType = ["bpmn:StartEvent", "bpmn:Task", "bpmn:EndEvent"]
      elementRegistry.forEach(e => {
        if (elementType.includes(e.type)) {
          let incoming = [];
          let outgoing = [];
          // console.log(e)
          let curObj = e.businessObject;
          //incoming outgoing均是SequenceWorkflow的头和尾
          if (curObj.incoming) {
            curObj.incoming.forEach(curIncoming => {
              // console.log(curIncoming)
              let json = {};
              json["outputNodeId"] = curIncoming.sourceRef.id;
              json["inputNodeId"] = curIncoming.targetRef.id;
              json["outputInterface"] = curIncoming.$attrs.flowOutput;
              json["inputInterface"] = curIncoming.$attrs.flowInput;
              json["inputDataType"] = curIncoming.$attrs.inputDataType;
              // json["nodeAllowedType"]=curIncoming.$attrs.nodeAllowedType;
              incoming.push(json)
            })
          }
          // console.log("incoming",incoming)
          if (curObj.outgoing) {
            curObj.outgoing.forEach(curOutgoing => {
              // console.log(curOutgoing)
              let json = {}
              json["outputNodeId"] = curOutgoing.sourceRef.id;
              json["inputNodeId"] = curOutgoing.targetRef.id;
              json["outputInterface"] = curOutgoing.$attrs.flowOutput;
              json["inputInterface"] = curOutgoing.$attrs.flowInput;
              json["inputDataType"] = curOutgoing.$attrs.inputDataType;
              // json["nodeAllowedType"]=curOutgoing.$attrs.nodeAllowedType;
              outgoing.push(json)
            })
          }
          const modeling = this.bpmnModeler.get("modeling");
          const incomingString = JSON.stringify(incoming)
          const outgoingString = JSON.stringify(outgoing)
          modeling.updateProperties(e, {nodeIncoming: incomingString, nodeOutgoing: outgoingString})
        }
      })
    },

    chainSelection() {
      this.openChainSelection = !this.openChainSelection;
    },
    closeChainSelection() {
      this.openChainSelection = false;
    },

    // 获取流程图中所有节点信息
    getNodeInfoList() {
      const elementRegistry = this.bpmnModeler.get('elementRegistry')
      const start = elementRegistry.filter(
        (item) => item.type === 'bpmn:StartEvent'
      )
      // start 便是流程图中所有的开始（数据输入）节点的集合
      // console.log(start)
    },

    // 绑定事件，后面根据需要再补充
    addEventBusListener() {
      const eventBus = this.bpmnModeler.get('eventBus');
      // 注册节点事件，eventTypes中可以写多个事件
      const eventTypes = ['element.click', 'element.hover', 'element.changed'];
      eventTypes.forEach((eventType) => {
        eventBus.on(eventType, (e) => {
          const {element} = e
          if (!element.parent) return
          if (!e || element.type === 'bpmn:Process') {
            return false
          } else {
            if (eventType === 'element.click') {
              // 节点点击后想要做的处理
              // 此时想要点击节点后，拿到节点实例，通过外部输入更新节点名称
              // this.currentElement = element
              // console.log(element);
              // console.log('this.bpmnModeler', this.bpmnModeler.get('elementRegistry'));
            } else if (eventType === 'element.hover') {
              // 鼠标滑过节点后想要做的处理
              // console.log('鼠标经过节点啦~')
            } else if (eventType === 'element.changed') {
              // 鼠标滑过节点后想要做的处理
            }
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
/*左边工具栏以及编辑节点的样式*/
.containers {
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0px;
  background-color: #ffffff;
  width: 100%;
  height: 94.4%;

  .canvas {
    position: absolute;
    width: calc(100% - 320px);
    height: 94.4%;
  }

  .bjs-powered-by {
    display: none;
  }

  .panel {
    position: absolute;
    right: 0;
    width: 320px;
    overflow: auto;
  }

  .toolbar {
    position: absolute;
    top: 20px;
    right: 350px;

    a {
      text-decoration: none;
      margin: 5px;
      color: #409eff;
    }
  }

  .selection-button {
    background-color: #409eff;
    color: #ffffff;
    border: 1px solid #9696b4
  }
}

</style>
