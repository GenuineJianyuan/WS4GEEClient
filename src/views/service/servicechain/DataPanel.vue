<template>
  <div class="property-panel" ref="propertyPanel">
    <el-form :inline="true" :model="form" label-width="90px" size="small">
      <el-form-item label="Name">
        <el-input v-model="processName" disabled></el-input>
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="processDescription" disabled></el-input>
      </el-form-item>
      <el-form-item label="Node ID">
        <el-input v-model="form.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="Node Name">
        <el-input v-model="form.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="Node Color">
        <el-color-picker v-model="form.color" @active-change="colorChange" disabled></el-color-picker>
      </el-form-item>

      <!-- 数据类型选择节点允许选择数据类型 -->
      <el-form-item label="Data Type" v-if="dataType">
        <el-input v-model="form.inputDataType" placeholder="select here" disabled>
        </el-input>
      </el-form-item>

      <el-form-item label="Data Format" v-if="dataType">
        <el-select v-model="form.format" placeholder="select here"
                   @change="(value) => formatChange( value)">
          <el-option
            v-for="item in allowedDatatype"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 数据类型选择节点允许选择数据类型 -->
      <div v-if="dataType && form.inputDataType!=null && form.inputDataType!='literal'">
        <el-form-item label="choose data">
          <el-select v-model="form.inputDataSource" :label-in-value="true" placeholder="select here"
                     @change="(value) => setData(value)">
            <el-option
              v-for="item in datasource"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="more">
          <el-button @click="dialogFormVisible = true">click to load</el-button>

          <el-dialog title="more" :visible.sync="dialogFormVisible">
            <el-form :model="loadform">
              <el-form-item label="upload type">
                <el-select v-model="loadform.method" placeholder="select here" @change="(value) => setMethod(value)">
                  <el-option label="upload by URL" value="remote"></el-option>
                  <el-option label="upload local file" value="local"></el-option>
                </el-select>
              </el-form-item>
              <br>
              <br>
              <el-form-item label="URL:" v-if="loadform.method==='remote'">
                <el-input v-model="loadform.url" autocomplete="off" style="width: 450px" @input="urlChange"></el-input>
              </el-form-item>

              <el-form-item label="upload local file:" v-if="loadform.method==='local'">
                <el-upload
                  class="upload-demo"
                  action=""
                  :on-change="handleChange"
                  :file-list="fileList">
                  <el-button size="small" type="primary">click to upload</el-button>
                  <div slot="tip" class="el-upload__tip">only JPG/PNG files less than 500 KB are allowed</div>
                </el-upload>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="btnCancel()">cancel</el-button>
              <el-button type="primary" @click="btnConfirm()">OK</el-button>
            </div>
          </el-dialog>
        </el-form-item>
      </div>
      <div v-else-if="dataType && form.inputDataType!=null && form.inputDataType=='literal'">
        <el-form-item label="Data Input">
          <el-input v-model="form.inputDataSource" placeholder="input here"
                    @input="(value)=>setUserInputData(value)"></el-input>
        </el-form-item>
      </div>


      <el-form-item label="Service" v-if="abstractServiceChosen">
        <el-input v-model="form.abstractServiceName" placeholder="select here" disabled>
        </el-input>
      </el-form-item>

      <el-form-item label="Data Output" v-if="flowChosen">
        <el-input v-model="form.flowOutput" placeholder="select here" disabled>
        </el-input>
      </el-form-item>

      <el-form-item label="Data Input" v-if="flowChosen">
        <el-input v-model="form.flowInput" placeholder="select here" disabled>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

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
      return this.form.inputDataSource != null || this.form.abstractService != null;
    }
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
      loadform: {
        url: "",
        method: ""
      },
      fileList: [],
      element: {},
      datatype: [],
      datasource: [],
      abstractServicelist: [],
      flowOutput: [],
      flowInput: [],
      allowedDatatype: [],
      format: "",
      dialogFormVisible: false,
    };
  },
  mounted() {
    this.handleModeler();
  },
  methods: {
    handleChange() {

    },
    urlChange(url) {
      console.log("user input url", url)
      this.loadform.url = url;
    },
    setMethod(value) {
      this.loadform.method = value;
    },
    btnCancel() {
      this.dialogFormVisible = false;
    },
    btnConfirm() {
      if (!this.loadform.url || this.loadform.url.trim() === "") {
        alert("请设置url")
        return;
      }
      this.form.inputDataSource = this.loadform.url;
      this.updateProperties({inputDataSource: this.loadform.url});
      this.dialogFormVisible = false;

    },
    handleModeler() {
      let that = this;
      // 点击事件监听节点选择变化

      this.modeler.on("import.done", ({ error, definitions, context }) => {
        // manipulate definitions before import
        this.getProcessInformation();
      });

      this.modeler.on("selection.changed", e => {
          const element = e.newSelection[0];
          this.element = element;
          if (!element || element.type === "bpmn:Process") {
            // return;
            that.form = {
              id: "",
              name: "",
              color: "",
              type: "",
              serviceDescription: ""
            };
            return;
          }

          if (element && element.type === "bpmn:StartEvent") {

            //输入数据类型
            const curDatatype = element.businessObject.$attrs.dataType;
            this.allowedDatatype = [];
            if (curDatatype === "vector") {
              this.allowedDatatype.push({
                value: "application/x-zipped-shp$base64",
                label: "application/x-zipped-shp$base64"
              })
              this.allowedDatatype.push({value: "application/x-zipped-shp", label: "application/x-zipped-shp"})
            } else if (curDatatype === "raster") {
              this.allowedDatatype.push({value: "image/tiff", label: "image/tiff"})
              this.allowedDatatype.push({value: "image/tiff$base64", label: "image/tiff$base64"})
              this.allowedDatatype.push({value: "image/jpeg", label: "image/jpeg"})
              this.allowedDatatype.push({value: "image/png", label: "image/png"})
            } else if (curDatatype === "text") {
              this.allowedDatatype.push({value: "text/plain", label: "text/plain"})
            } else if (curDatatype === "image") {
              this.allowedDatatype.push({value: "image/tiff", label: "image/tiff"})
              this.allowedDatatype.push({value: "image/tiff$base64", label: "image/tiff$base64"})
              this.allowedDatatype.push({value: "image/jpeg", label: "image/jpeg"})
              this.allowedDatatype.push({value: "image/png", label: "image/png"})
            } else if (curDatatype === "dem") {
              this.allowedDatatype.push({value: "image/tiff", label: "image/tiff"})
              this.allowedDatatype.push({value: "image/tiff$base64", label: "image/tiff$base64"})
              this.allowedDatatype.push({value: "image/jpeg", label: "image/jpeg"})
              this.allowedDatatype.push({value: "image/png", label: "image/png"})
            } else if (curDatatype === "literal") {
              this.allowedDatatype.push({value: "integer", label: "integer"})
              this.allowedDatatype.push({value: "float", label: "float"})
              this.allowedDatatype.push({value: "string", label: "string"})
              this.allowedDatatype.push({value: "boolean", label: "boolean"})
              // this.allowedDatatype.push({value: "xs:integer", label: "xs:integer"})
              // this.allowedDatatype.push({value: "xs:float", label: "xs:float"})
              // this.allowedDatatype.push({value: "xs:string", label: "xs:string"})
              // this.allowedDatatype.push({value: "xs:boolean", label: "xs:boolean"})
              // this.allowedDatatype.push({value: "xs:double", label: "xs:double"})
            }

            //获取输入数据列表
            this.$http({
              method: 'get',
              url: 'api/serviechain/testGetDatasource'
            }).then(response => {
              const result = (response.data)
              if (result.code === 0) {
                const data = result.data;
                this.datasource = [];
                data.forEach(json => {
                  this.datasource.push(
                    {
                      label: json.label,
                      value: json.value
                    })
                })
              }
            })


          }
          that.form = {
            ...element.businessObject,
            ...element.businessObject.$attrs
          };
          that.form.id = element.id;
          that.form.type = element.type;
          if (element && element.type === "bpmn:StartEvent") {
            let curNodeOutgoing = JSON.parse(element.businessObject.$attrs["ge:nodeOutgoing"])[0];
            const curFormat = curNodeOutgoing["dataFormat"]
            const curDataSource = curNodeOutgoing["inputDataSource"]
            if (curFormat) that.form.format = curFormat;
            if (curDataSource) that.form.inputDataSource = curDataSource;
          }


          // if (element.businessObject.$attrs.inputDataSource) {
          //   that.form.serviceDescription = element.businessObject.$attrs.inputDataSource + "描述"
          // }

          // if (element && element.businessObject.$attrs.abstractService) {
          //   that.form.serviceDescription = element.businessObject.$attrs.abstractService + "描述"
          // }
          this.getProcessInformation();
        }
      );

      // 监听节点属性变化
      // this.modeler.on("element.changed", e => {
      //   const { element } = e;
      //   if (!element) return;
      //   //  新增节点需要更新回属性面板
      //   if (element.id === this.form.id) {
      //     this.form.name = element.businessObject.name;
      //     this.form = { ...this.form };
      //   }
      // });
    },

    getProcessInformation() {
      const elementRegistry = this.modeler.get('elementRegistry')
      const start = elementRegistry.filter(
        (item) => item.type === 'bpmn:Process'
      );
      const ele = start[0];
      this.processName = ele.businessObject.name;
      this.processDescription = ele.businessObject.$attrs.description;
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

    // 切换数据选择
    formatChange(value) {
      //需要更改当前节点的ed:nodeOutgoing，以及与该节点连接的服务节点的ed:nodeIncoming属性，设置dataFormat属性
      let curElementNodeOutgoing = JSON.parse(this.element.businessObject.$attrs["ge:nodeOutgoing"])[0];
      const elementId = this.element.businessObject.id;
      //StartEvent数据节点只会有一个nodeOutgoing，即它自己，因此直接更新
      curElementNodeOutgoing["dataFormat"] = value;
      let newElementNodeOutgoing = [];
      newElementNodeOutgoing.push(curElementNodeOutgoing);
      this.updateProperties({"ge:nodeOutgoing": JSON.stringify(newElementNodeOutgoing)});
      this.form.format = value;
      this.$forceUpdate();
    },

    // 数据节点配置数据来源
    setData(value) {
      //需要更改当前节点的ed:nodeOutgoing，以及与该节点连接的服务节点的ed:nodeIncoming属性，设置dataFormat属性
      let curElementNodeOutgoing = JSON.parse(this.element.businessObject.$attrs["ge:nodeOutgoing"])[0];
      const elementId = this.element.businessObject.id;
      //StartEvent数据节点只会有一个nodeOutgoing，即它自己，因此直接更新
      curElementNodeOutgoing["inputDataSource"] = value;
      let newElementNodeOutgoing = [];
      newElementNodeOutgoing.push(curElementNodeOutgoing);
      this.updateProperties({"ge:nodeOutgoing": JSON.stringify(newElementNodeOutgoing)});
      this.form.inputDataSource = value;
      this.$forceUpdate();
    },

    //literal
    setUserInputData(value) {
      //需要更改当前节点的ed:nodeOutgoing，以及与该节点连接的服务节点的ed:nodeIncoming属性，设置dataFormat属性
      let curElementNodeOutgoing = JSON.parse(this.element.businessObject.$attrs["ge:nodeOutgoing"])[0];
      const elementId = this.element.businessObject.id;
      //StartEvent数据节点只会有一个nodeOutgoing，即它自己，因此直接更新
      curElementNodeOutgoing["inputDataSource"] = value;
      let newElementNodeOutgoing = [];
      newElementNodeOutgoing.push(curElementNodeOutgoing);
      this.updateProperties({"ge:nodeOutgoing": JSON.stringify(newElementNodeOutgoing)});

      this.form.inputDataSource = value;
    },

    // 服务簇选择
    setAbstractService(properties) {
      this.updateProperties(properties);
      if (this.element.businessObject.$attrs.abstractService) {
        this.form.serviceDescription = this.element.businessObject.$attrs.abstractService + "描述"
      }
    },

    // 数据流输出选择
    setFlowOutput(properties) {
      this.updateProperties(properties);
      if (this.element.businessObject.$attrs.output) {
        this.form.output = this.element.businessObject.$attrs.output;
      }
    },

    // 数据流输入选择
    setFlowInput(properties) {
      this.updateProperties(properties);
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
  width: 300px;
  height: 100%;
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
