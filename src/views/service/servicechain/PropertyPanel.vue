<template>
  <div class="property-panel" ref="propertyPanel">
    <el-form :inline="true" :model="form" label-width="90px" size="small">
      <el-form-item label="Name">
        <el-input v-model="processName" @input="processNameChange"></el-input>
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="processDescription" @input="processDescriptionChange"></el-input>
      </el-form-item>
      <el-form-item label="Node ID">
        <el-input v-model="form.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="Node Name">
        <el-input v-model="form.name" @input="nameChange"></el-input>
      </el-form-item>
      <el-form-item label="Node Color">
        <el-color-picker v-model="form.color" @active-change="colorChange"></el-color-picker>
      </el-form-item>

      <!-- 数据类型选择节点允许选择数据类型 -->
      <el-form-item label="Data Type" v-if="dataType">
        <el-select v-model="form.inputDataType" placeholder="select here"
                   @change="(value) => dataTypeChange(value)">
          <el-option
            v-for="item in datatype"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!--      <el-form-item label="数据id" v-if="dataType">-->
      <!--        <el-input v-model="this.element.businessObject.$attrs.dataType+'_'+this.element.businessObject.id"-->
      <!--                  disabled></el-input>-->
      <!--      </el-form-item>-->

      <!-- 抽象服务节点允许选择抽象服务 -->
      <el-form-item label="Service" v-if="abstractServiceChosen">
        <el-select v-model="form.abstractServiceName" placeholder="select here" value-key="value" filterable
                   @change="setAbstractService">
          <el-option
            v-for="item in abstractServiceList"
            :key="item.value"
            :label="item.label"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>

      <textarea v-model="form.serviceDescription" v-if="hasChosenService" id="textarea" maxlength="500"
                readonly="true"></textarea>
      <br>

      <el-form-item label="Input" v-if="hasChosenService">
        <div v-for="(obj,index) in abstractServiceInputParams[this.element.id]">
          <el-input v-model="obj.name+'('+obj.inputNodeId+')'" @input="inputParamsChange" disabled></el-input>
        </div>
      </el-form-item>


      <el-form-item label="Output" v-if="hasChosenService">
        <div v-for="(obj,index) in abstractServiceOutputParams[this.element.id]">
          <el-input v-model="obj.name+'('+obj.outputNodeId+')'" @input="processNameChange" disabled></el-input>
        </div>
      </el-form-item>


      <el-form-item label="Data Output" v-if="flowChosen">
        <el-select v-model="form.flowOutput" placeholder="select here"
                   @change="(value) => setFlowOutput({flowOutput: value})">
          <el-option
            v-for="item in flowOutput"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Data Input" v-if="flowChosen">
        <el-select v-model="form.flowInput" placeholder="select here"
                   @change="(value) => setFlowInput({flowInput: value})">
          <el-option
            v-for="item in flowInput"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import {uuid} from "../../../api/commonapi";
import typeJSON from "../../../../static/json/TypeMapping.json"
import axios from "axios";

export default {
  name: "PropertyPanel",
  props: {
    modeler: {
      type: Object,
      required: true,
    }
  },
  computed: {
    dataType() {
      return this.form.type === "bpmn:StartEvent" || this.form.type === "bpmn:IntermediateThrowEvent";
    },
    abstractServiceChosen() {
      return this.form.type === "bpmn:Task";
    },
    flowChosen() {
      return this.form.type === "bpmn:SequenceFlow";
    },

    hasChosenService() {
      return this.form.abstractService != null;
    },
  },
  data() {
    return {
      serviceText: "www",
      processName: "",
      processDescription: "",
      form: {
        id: "",
        name: "",
        color: "",
        type: "",
        serviceDescription: ""
      },
      data: {},
      element: {},
      datatype: [],

      datatypeEnum: {
        "vector": "矢量数据",
        "raster": "栅格数据",
        "image": "影像数据",
        "text": "文本数据",
        "dem": "DEM数据",
        "literal": "直接输入数据"
      },
      abstractServiceList: [],
      abstractServiceInputParams: {},
      abstractServiceOutputParams: {},
      flowOutput: [
        {
          value: "output1",
          label: "输出1；栅格"
        },
        {
          value: "output2",
          label: "输出2；矢量"
        }
      ],
      flowInput: [
        {
          value: "input1",
          label: "输入1；栅格"
        },
        {
          value: "input2",
          label: "输入2；矢量"
        },
        {
          value: "input3",
          label: "输入3；栅格"
        }
      ]
    };
  },

  mounted() {
    this.handleModeler();
    this.getProcessInformation();
  },

  methods: {
    testGetAbstractServiceList() {
      this.$http({
        method: 'get',
        url: 'api/servicechain/testGetAbstractServiceList',
      }).then(response => {
        const result = (response.data)
        if (result.code === 0) {
          let serviceList = result.data;
          this.abstractServiceList = [];
          serviceList.forEach(element => {
            this.abstractServiceList.push({label: element.label, value: element.value})
          })
        }
      }).catch(function (error) { // 请求失败处理
        console.log(error);
      });
    },

    getAbstractServiceListByContext(allowedDatatype) {
      let nodeContext = {
        frontType: allowedDatatype["frontType"],
        frontId: allowedDatatype["frontId"],
        subsequentId: allowedDatatype["subsequentId"]
      }
      axios.post('api/servicechain/getservices/bycontext',
        nodeContext
      ).then(response => {
        const result = (response.data)
        if (result.code === 0) {
          let serviceList = result.data;
          this.abstractServiceList = [];
          serviceList.forEach(element => {
            this.abstractServiceList.push({label: element.identifier, value: element.serviceId})
          })
        }
      }).catch(function (error) { // 请求失败处理
        console.log(error);
      });
    },

    //该方法多处调用，因此提炼出来
    //检查该节点前驱节点输出类型，后继节点输入类型，并赋予到该节点的nodeAllowedType属性
    checkAllowedType(element) {
      console.log("check element", element)
      //查看其前驱后继情况
      const incoming = element.incoming;  //前驱可能是数据节点或者抽象服务（此处incoming指的是连接线）
      const outgoing = element.outgoing;  //后继可能是抽象服务或输出节点 （此处outgoing也是连接线）
      let allowedType = {"frontType": [], "frontId": [], "subsequentType": [], "subsequentId": []}//允许的类型，以及相关的服务/数据的id
      //前置节点的输出数据类型（当前默认每个incoming只有1个输出）
      if (incoming) {
        incoming.forEach(el => {
          if (el.businessObject.sourceRef.$attrs.abstractService) {
            allowedType["frontId"].push(el.businessObject.sourceRef.$attrs.abstractService);  //frontId可能是来源于StartEvent（数据服务）
          }
          if (el.businessObject.sourceRef.$attrs.outputparamsJson) {
            const currentOutputparams = JSON.parse(el.businessObject.sourceRef.$attrs.outputparamsJson);
            for (let i = 0; i < currentOutputparams.length; i++) {
              allowedType["frontType"].push(currentOutputparams[i]["datatype"]);
            }
          }
        })
      }
      if (outgoing) {
        outgoing.forEach(el => {
          if (el.businessObject.targetRef.$attrs.abstractService) {
            allowedType["subsequentId"].push(el.businessObject.targetRef.$attrs.abstractService);  //frontId可能是来源于StartEvent（数据服务）
          }
          if (el.businessObject.targetRef.$attrs.inputparamsJson) {
            const currentInputparams = JSON.parse(el.businessObject.targetRef.$attrs.inputparamsJson)
            for (let i = 0; i < currentInputparams.length; i++) {
              allowedType["subsequentType"].push(currentInputparams[i]["datatype"]);
            }
          }
        })
      }

      //2021/06/28 由于raster，dem，image同为抽象数据类型，且支持的具体类型相同，故能使用三者之一的数据类型必能使用其他两个
      if (allowedType["frontType"].indexOf("raster") !== -1 || allowedType["frontType"].indexOf("dem") !== -1 || allowedType["frontType"].indexOf("image") !== -1) {
        //此处可以重复，后续会去重
        allowedType["frontType"].push("raster");
        allowedType["frontType"].push("dem");
        allowedType["frontType"].push("image");
      }

      if (allowedType["subsequentType"].indexOf("raster") !== -1 || allowedType["subsequentType"].indexOf("dem") !== -1 || allowedType["subsequentType"].indexOf("image") !== -1) {
        //此处可以重复，后续会去重
        allowedType["subsequentType"].push("raster");
        allowedType["subsequentType"].push("dem");
        allowedType["subsequentType"].push("image");
      }

      allowedType["frontType"] = Array.from(new Set(allowedType["frontType"])); //去重
      allowedType["frontId"] = Array.from(new Set(allowedType["frontId"])); //去重
      allowedType["subsequentType"] = Array.from(new Set(allowedType["subsequentType"])); //去重
      allowedType["subsequentId"] = Array.from(new Set(allowedType["subsequentId"])); //去重

      this.updateProperties({nodeRestriction: JSON.stringify(allowedType)})
      // console.log("Task1",element)
      return allowedType;
    },

    handleModeler() {
      let that = this;
      this.modeler.on("import.done", ({error, definitions, context}) => {
        // manipulate definitions before import
        this.getProcessInformation();
      });
      // 点击事件监听节点选择变化
      this.modeler.on("selection.changed", e => {
        const element = e.newSelection[0];
        this.element = element;

        if (!element || element.type === "bpmn:Process") {
          that.form = {
            id: "",
            name: "",
            color: "",
            type: "",
            serviceDescription: ""
          };
          return;
        }

        //StartEvent是数据节点
        if (element && element.type === "bpmn:StartEvent") {

          let allowedDatatype = this.checkAllowedType(element);
          this.datatype = [];
          if (allowedDatatype.subsequentType && allowedDatatype.subsequentType.length > 0) {
            allowedDatatype.subsequentType.forEach(curDatatype => {
              this.datatype.push({value: curDatatype, label: this.datatypeEnum[curDatatype]})
            })
          } else {
            this.datatype = [
              {
                value: "vector",
                label: "矢量数据"
              },
              {
                value: "raster",
                label: "栅格数据"
              },
              {
                value: "image",
                label: "影像数据"
              },
              {
                value: "text",
                label: "文本数据"
              },
              {
                value: "dem",
                label: "DEM数据"
              },
              {
                value: "literal",
                label: "直接输入数据"
              }];
          }

          const datatype = element.businessObject.$attrs.inputDataType;
          this.updateProperties({dataId: datatype + "_" + element.businessObject.id})
          console.log("允许的数据类型", element.businessObject.$attrs.nodeRestriction)
        }

        //设置连接线，bpmnjs中连接线存在意味着已经有连接了的前驱后继
        if (element && element.type === "bpmn:SequenceFlow") {
          console.log("SequenceFlow", element)
          //先讨论箭头左边，只考虑有一个前驱输出（箭头的输入）
          const sourceRef = element.businessObject.sourceRef;
          let sourceAttrs = sourceRef.$attrs;
          const sourceType = sourceRef.$type;
          if ((!sourceAttrs) || (!sourceAttrs.outputparamsJson)) {
            if (sourceType === "bpmn:Task") {
              console.log("请先设置前驱抽象服务！");
              return;
            } else if (sourceType === "bpmn:StartEvent") {
              console.log("请先设置前驱数据节点！");
              return;
            }
          }
          //假设有多个输入（即前置节点的输出），事实上52nWPS+Grass方法只能传出一个输出
          //当前前驱存在数据流入
          this.flowOutput = []
          const curOutputparamsJson = JSON.parse(sourceAttrs.outputparamsJson);
          for (let i = 0; i < curOutputparamsJson.length; i++) {
            let inputDataId = curOutputparamsJson[i]["outputNodeId"];
            let inputDataName = curOutputparamsJson[i]["name"];
            this.flowOutput.push({
              value: inputDataId,
              // label: inputDataName
              label: inputDataId
            })
          }

          // 讨论后继输入（箭头的输出）可能有多个选项，当前输入的对象只能是Task或者EndEvent
          // 但是后继输入的数据类型只能传入到和前驱传出一样的数据类型的接口中；例如前驱传出一个txt，那么只能传到后继抽象服务的支持txt的接口中，例如buffer中的distance
          const targetRef = element.businessObject.targetRef;
          let targetAttrs = targetRef.$attrs;
          const targetType = targetRef.$type;
          let allowedDatatype = [];

          for (let i = 0; i < curOutputparamsJson.length; i++) {
            allowedDatatype.push(curOutputparamsJson[i]["datatype"]);
          }
          if (allowedDatatype.includes("raster") || allowedDatatype.includes("dem") || allowedDatatype.includes("image")) {
            allowedDatatype = ["raster", "dem", "image"]
          }
          this.flowInput = []
          if (targetType === "bpmn:Task") {
            if ((!targetAttrs) || (!targetAttrs.inputparamsJson)) {
              console.log("请先设置后继抽象服务！");
              return;
            }
            const curInputparamsJson = JSON.parse(targetAttrs.inputparamsJson);
            curInputparamsJson.forEach(input => {
              console.log(input)
              console.log("allowedDatatype", allowedDatatype)
              if (allowedDatatype.includes(input["datatype"])) {
                this.flowInput.push({
                  value: input["inputNodeId"],
                  // label: input["name"]
                  label: input["inputNodeId"]
                })
              }
            })
          } else if (targetType === "bpmn:EndEvent") {
            this.flowInput.push({
              value: "End",
              label: "End"
            })
          }
        }

        // 此处点击后获取抽象服务列表;
        // 根据需求，这里实际应该读取前，后节点的支持数据类型，以提供选择方案
        //需要做的事情：更新该节点的前驱后继允许的数据类型
        if (element && element.type === "bpmn:Task") {
          //如果是载入的bpmn，则抽象服务已经确定，需要给该服务的input output输入输出赋值
          if (element.businessObject.$attrs.inputparamsJson) {
            this.abstractServiceInputParams[element.id] = [];
            const curInputparamsJson = JSON.parse(element.businessObject.$attrs.inputparamsJson);
            curInputparamsJson.forEach(input => {
              this.abstractServiceInputParams[element.id].push({
                datatype: input["datatype"],
                name: input["name"],
                inputNodeId: input["inputNodeId"]
              })
            })
          }
          if (element.businessObject.$attrs.outputparamsJson) {
            this.abstractServiceOutputParams[element.id] = [];
            const curOutputparamsJson = JSON.parse(element.businessObject.$attrs.outputparamsJson);
            curOutputparamsJson.forEach(output => {
              this.abstractServiceOutputParams[element.id].push({
                datatype: output["datatype"],
                name: output["name"],
                outputNodeId: output["outputNodeId"]
              })
            })
          }


          let allowedDatatype = this.checkAllowedType(element);
          console.log("抽象服务只会根据如下推荐", JSON.stringify(allowedDatatype))

          // 获取抽象服务列表（此处为获取所有的抽象服务）
          //此处拟根据allowedDatatype变量推荐服务列表
          // this.testGetAbstractServiceList()
          this.getAbstractServiceListByContext(allowedDatatype)
        }

        // console.log((element.type))
        that.form = {
          ...element.businessObject,
          ...element.businessObject.$attrs
        };
        that.form.id = element.id;
        that.form.type = element.type;
        if (element && element.businessObject.$attrs.abstractService) {
          that.form.serviceDescription = element.businessObject.$attrs.serviceDescription
        }
        this.getProcessInformation();
      });


      // 监听节点属性变化
      this.modeler.on("element.changed", e => {
        const {element} = e;
        if (!element) return;
        //  新增节点需要更新回属性面板
        if (element.id === this.form.id) {
          this.form.name = element.businessObject.name;
          this.form = {...this.form};
        }
      });
    },


    // 属性面板名称，更新回流程节点
    nameChange(name) {
      if ((this.element) && (this.element.id === this.form.id)) {
        const modeling = this.modeler.get("modeling");
        modeling.updateLabel(this.element, name);
      }
    },

    getProcessInformation() {
      const elementRegistry = this.modeler.get('elementRegistry')
      const start = elementRegistry.filter(
        (item) => item.type === 'bpmn:Process'
      );
      const ele = start[0];

      if (ele) {
        this.processName = ele.businessObject.name;
        this.processDescription = ele.businessObject.$attrs.description;
      }
    },

    // 输入参数变化
    inputParamsChange(name) {
      console.log(name)
    },

    // 服务链名称，更新回流程
    processNameChange(name) {
      const elementRegistry = this.modeler.get('elementRegistry')
      const start = elementRegistry.filter(
        (item) => item.type === 'bpmn:Process'
      )
      const ele = start[0]
      const modeling = this.modeler.get("modeling");
      modeling.updateProperties(ele, {name: name})
    },
    // 服务链描述，更新回流程
    processDescriptionChange(description) {
      const elementRegistry = this.modeler.get('elementRegistry')
      const start = elementRegistry.filter(
        (item) => item.type === 'bpmn:Process'
      )
      const ele = start[0]
      const modeling = this.modeler.get("modeling");
      modeling.updateProperties(ele, {description: description})
    },

    // 属性面板颜色，更新回流程节点
    colorChange(color) {
      if (color && this.element) {
        const modeling = this.modeler.get("modeling");
        modeling.setColor(this.element, {
          fill: null,
          stroke: color
        });
        modeling.updateProperties(this.element, {color: color});
      }
    },

    // 切换数据类型
    dataTypeChange(value) {
      //0623这里增加一个数据结构，以与操作节点相同
      let outputparamsJson = [];
      outputparamsJson.push({
        "datatype": value,
        "name": value + '_' + this.element.businessObject.id,
        // desr: element.desr,
        // default: element.default ? element.default : null,
        "outputNodeId": value + '_' + this.element.businessObject.id
      })
      this.updateProperties({
        inputDataType: value,
        dataType: value,
        dataId: value + '_' + this.element.businessObject.id
      });
      this.updateProperties({outputparamsJson: JSON.stringify(outputparamsJson)})

      //根据选择赋予节点默认值(vector, raster....)
      function getServiceElement(el) {
        return el.value == value;
      }

      const curAbstractService = this.datatype.find(getServiceElement);
      const modeling = this.modeler.get("modeling");
      modeling.updateLabel(this.element, curAbstractService.value);
      // console.log("test",this.element.businessObject.$attrs)

      //若数据节点已经做了具体设置，则赋予颜色（绿色）
      modeling.setColor(this.element, {
        fill: null,
        stroke: "green"
      });
      modeling.updateProperties(this.element, {color: "green"});
    },


    // 抽象服务（服务簇）选择
    setAbstractService(item) {
      this.updateProperties({abstractService: item.value});
      this.updateProperties({abstractServiceName: item.label});

      function getServiceElement(el) {
        return el.value == item.value;
      }

      function getMappingType(origin) {
        console.log(origin)
        let targetType = null;
        for (let key in typeJSON) {
          const currentTypes = typeJSON[key];
          for (let i = 0; i < currentTypes.length; i++) {
            if (currentTypes[i].indexOf(origin) != -1) {
              targetType = key;
              continue;
            }
          }
        }
        return targetType
      }

      function getMappingTypeList(origin) {
        console.log(origin)
        let targetType = null;
        for (let key in typeJSON) {
          const currentTypes = typeJSON[key];
          for (let i = 0; i < currentTypes.length; i++) {
            for (let j = 0; j < origin.length; j++) {
              if (currentTypes[i].indexOf(origin[j]) != -1) {
                targetType = key;
                return targetType;
              }
            }
          }
        }
        return targetType
      }

      const curAbstractService = this.abstractServiceList.find(getServiceElement);
      if (this.element.businessObject.$attrs.abstractService) {

        //给节点赋值默认值
        const modeling = this.modeler.get("modeling");
        modeling.updateLabel(this.element, curAbstractService.label);

        const curId = this.element.businessObject.$attrs.abstractService;
        const curElementId = this.element.id;

        //获取当前选择服务的详细输入输出（这是一个测试方法）
        this.$http({
          method: 'get',
          url: 'api/service/abstractservice/' + curId,
        }).then(response => {
          const result = (response.data)
          if (result.code === 0) {
            // 尽管这样写不优雅
            let inputparamsJson = [];
            let outputparamsJson = [];

            //后端读取的input/output
            let params = result.data;
            this.updateProperties({serviceDescription: params.serviceDescription});
            console.log(result.data)
            console.log(this.element)
            this.abstractServiceInputParams[curElementId] = [];
            params.inputInterfaces.forEach(element => {
              // const inputNodeId = uuid();
              const curDataType = getMappingType(element.dataFormat)!= undefined? getMappingType(element.dataFormat):getMappingTypeList(element.supportedDataFormat)

              inputparamsJson.push(
                {
                  "datatype": curDataType,
                  "name": element.interfaceName,
                  "inputNodeId": element.interfaceIdentifier
                }
              )
              this.abstractServiceInputParams[curElementId].push({
                datatype: curDataType,
                name: element.interfaceName,
                inputNodeId: element.interfaceIdentifier
              })
            })
            this.abstractServiceOutputParams[curElementId] = [];
            params.outputInterfaces.forEach(element => {
              // const outputNodeId = uuid()
              const curDataType = getMappingType(element.dataFormat)!= undefined? getMappingType(element.dataFormat):getMappingTypeList(element.supportedDataFormat)
              // const curDataType = getMappingType(element.supportedDataFormat)
              outputparamsJson.push({
                  "datatype": curDataType,
                  "name": element.interfaceName,
                  "outputNodeId": element.interfaceIdentifier
                }
              )
              this.abstractServiceOutputParams[curElementId].push({
                datatype: curDataType,
                name: element.interfaceName,
                outputNodeId: element.interfaceIdentifier
              })
            })
            this.updateProperties({
              inputparamsJson: JSON.stringify(inputparamsJson),
              outputparamsJson: JSON.stringify(outputparamsJson)
            })//把该节点输入输出信息传入

            //若设置抽象服务节点完毕，则赋予颜色（蓝色）
            modeling.setColor(this.element, {
              fill: null,
              stroke: "blue"
            });
            this.form.serviceDescription = this.element.businessObject.$attrs.serviceDescription
            modeling.updateProperties(this.element, {color: "blue"});
          }
          this.$forceUpdate();
        }).catch(function (error) { // 请求失败处理
          console.log(error);
        });

      }
    },

    // 数据流输出选择（从前驱结点输出）
    setFlowOutput(properties) {
      this.updateProperties(properties);
      const sourceRef = this.element.businessObject.sourceRef;
      //需要分别处理数据节点和处理节点
      if (sourceRef.$type === "bpmn:StartEvent" && sourceRef.$attrs.dataType) {
        this.updateProperties({inputDataType: sourceRef.$attrs.dataType});
      }
      if (sourceRef.$type === "bpmn:Task" && sourceRef.$attrs.outputparamsJson) {
        const curOutputparams = JSON.parse(sourceRef.$attrs.outputparamsJson);
        const curToNodeId = properties.flowOutput;  //前置服务的接口的Id
        for (let i = 0; i < curOutputparams.length; i++) {
          const targetNodeId = curOutputparams[i]["outputNodeId"];
          if (curToNodeId === targetNodeId) {
            this.updateProperties({inputDataType: curOutputparams[i]["datatype"]});
          }
        }
      }

      if (this.element.businessObject.$attrs.output) {
        this.form.output = this.element.businessObject.$attrs.output;
      }
    },

    // 数据流输入选择（传向后继节点）
    setFlowInput(properties) {
      this.updateProperties(properties);
      const targetRef = this.element.businessObject.targetRef;
      //后继节点只能是处理节点或者End
      //在此处设置输出节点的颜色
      if (targetRef.$type === "bpmn:EndEvent") {
        //若数据节点已经做了具体设置，则赋予颜色（黄色）
        const elementRegistry = this.modeler.get('elementRegistry')
        const modeling = this.modeler.get("modeling");

        const ends = elementRegistry.filter(
          (item) => item.type === 'bpmn:EndEvent'
        )
        ends.forEach(end => {
          modeling.setColor(end, {
            fill: null,
            stroke: "yellow"
          });
          modeling.updateProperties(end, {color: "yellow"});
        })
      }
      // if (targetRef.$type === "bpmn:Task" && targetRef.$attrs.inputparamsJson) {
      //   const curToNodeId = properties.flowInput;  //当前传向的下一个服务的接口的id
      //   let requestDataType = null;
      //   targetRef.$attrs.inputparams.forEach(input => {
      //     if (input.inputNodeId === curToNodeId) {
      //       requestDataType = input.datatype;
      //     }
      //   })
      //   this.updateProperties({requestDataType: requestDataType})
      // }
      if (this.element.businessObject.$attrs.input) {
        this.form.input = this.element.businessObject.$attrs.input;
      }
    },

    // 在这里封装一个通用的更新节点属性的方法
    updateProperties(properties) {
      const modeling = this.modeler.get("modeling");
      modeling.updateProperties(this.element, properties);
    }
  }
};

</script>

<style lang="scss" scoped>
.property-panel {
  position: absolute;
  right: 0px;
  top: 0px;
  border-left: 1px solid #cccccc;
  padding: 20px 0;
  width: 320px;
  height: 100%;
  overflow: auto
}

#textarea {
  display: block;
  width: 280px;
  border: 0;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 15px;
  outline: none;
  border-radius: 5px;
  padding: 10px;
  background-color: #efe9db;
  word-break: break-all;
  min-height: 200px;
}
</style>
