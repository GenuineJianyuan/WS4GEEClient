<template>
  <div class="containers">
    <el-tabs v-model="activeName" type="card" class="new_tabs_header">
      <el-tab-pane label="Data Service Creator" name="first">
        <el-card class="box-card" shadow="always" id="searchForm">
          <div slot="header" class="clearfix">
            <span>WS4GEE Generate Engine</span>
          </div>
          <div>
            <el-form ref="form" :model="dataForm" label-width="110px" class="wcs">
              <el-form-item label="Dataset" size="small">
                <el-select v-model="dataForm.dataset" placeholder="Please select dataset" style="width: 350px"
                           @change="datasetOptionChange">
                  <el-option
                    v-for="item in datasetOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Service" size="small">
                <el-radio-group v-model="dataForm.service">
                  <el-radio disabled label="WCS"></el-radio>
                  <!--                    <el-radio disabled label="WFS"></el-radio>-->
                  <!--                    <el-radio label="WMS"></el-radio>-->
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Stacking type" size="small">
                <el-radio-group v-model="dataForm.stacking">
                  <el-radio label="mean">by mean</el-radio>
                  <el-radio label="min">by min</el-radio>
                  <el-radio label="max">by max</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Date range" size="small">
                <el-date-picker
                  v-model="dataForm.daterange"
                  unlink-panels
                  type="daterange"
                  range-separator="to"
                  value-format="yyyy-MM-dd"
                  start-placeholder="Start Date"
                  end-placeholder="End Date">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="Other Options" size="small">
                <el-select v-model="dataForm.options" multiple @change="generateOptionsChange"
                           filterable
                           allow-create
                           default-first-option
                           placeholder="Please select generation options" style="width: 350px">
                  <el-option v-for="item in generateOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
                <el-button type="text" size="medium" @click="moreOption=true">More Options</el-button>
                <el-dialog title="More Options" :visible.sync="moreOption">
                  <el-form :model="dataForm" label-position="right">
                    <el-form-item label="Bands">
                      <el-input v-model="dataForm.bands"
                                placeholder="Add bands for target dataset. Split with ; e.g. B1;B2;B3"></el-input>
                    </el-form-item>
                    <el-form-item label="Additional keywords">
                      <el-input v-model="dataForm.keywords"
                                placeholder="Add additional keywords. Split with ;"></el-input>
                    </el-form-item>
                    <el-form-item label="Abstract">
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="Abstract for the target Data/Dataset"
                        v-model="dataForm.dataAbstract">
                      </el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="moreOption = false">Close</el-button>
                  </div>
                </el-dialog>
              </el-form-item>

              <el-form-item :inline="true" label-position="left" label="Boundary">
                <el-input v-model="dataForm.uploadBoundaryName"
                          placeholder="Name to the boundary" size="small"
                          style="width: 350px"></el-input>
              </el-form-item>
              <el-form-item>
                <el-radio-group v-model="dataForm.uploadType" default>
                  <el-radio :label="1">Local Resource</el-radio>
                  <el-radio :label="2">Remote Resource</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item size="small" :inline="true" v-if="dataForm.uploadType==1">
                <el-upload
                  :on-success="handleBoundaryAvatarSuccess"
                  class="upload-demo"
                  action="api/ws4gee/boundaryFiles/">
                  <el-button size="small" type="primary">Import Remote Source</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item v-if="dataForm.uploadType==2">
                <el-input v-if="dataForm.uploadType==2" v-model="dataForm.uploadBoundaryContent"
                          placeholder="https://sourceURL/files.json(.geojson)" size="small"
                          style="width: 350px"></el-input>
              </el-form-item>
              <el-form-item style="margin-left: 40px">
                <el-button type="primary" @click="onDataGenerationSubmit" plain size="medium">Submit</el-button>
                <el-button plain size="medium">Reset</el-button>
              </el-form-item>
            </el-form>
            <el-divider></el-divider>

            <div style="margin-bottom: 10px">
              <div class="demonstration">Generate Result</div>
            </div>
            <div>
              <el-table
                ref="singleTable" :data="tableData" border highlight-current-row @current-change="handleCurrentChange"
                style="width: 100%" height="180" :cell-style="{padding: '0'}"
                @row-click="handleCurrentClick" class="new_table_row">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column property="identifier" label="Available Services"></el-table-column>
              </el-table>
            </div>
            <div>
              <div class="demonstration" style="font-size: 14px">
                <span>Group Name:{{ groupName }}
                  <el-button type="text" icon="el-icon-edit" @click="editName=true">Edit</el-button>
                </span>
                <el-dialog title="Rename the generate group" :visible.sync="editName" width="30%">
                  <el-form label-position="right">
                    <el-form-item label="New Group Name">
                      <el-input v-model="newGroupName"></el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="setNewGroupName">Submit</el-button>
                    <el-button @click="editName = false">Cancel</el-button>
                  </div>
                </el-dialog>
              </div>
            </div>
            <div style="margin-left:15px">
              <el-button @click="callWCS('getcapabilities')">GetCapabilities</el-button>
              <el-button @click="callWCS('describecoverage')">DescribeCoverage</el-button>
              <el-button @click="callWCS('getcoverage')">GetCoverage</el-button>
              <el-dialog title="Coverage" :visible.sync="coverageInfoDialog">
                <el-input type="textarea" :rows="10" resize="none" v-model="xmlInfoContent"></el-input>
                <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="coverageInfoDialog=false">Close</el-button>
                </div>
              </el-dialog>
              <el-dialog title="GetCoverage" :visible.sync="coverageDialog"
                         :close-on-click-modal="false">
                <el-input type="textarea" :rows="10" resize="none" v-model="xmlContent"></el-input>
                <span>Result:</span>
                <el-input type="textarea" :rows="10" resize="none" v-model="xmlResult"></el-input>
                <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="sendRequest">Submit</el-button>
                  <el-button @click="coverageDialog = false">Cancel</el-button>
                </div>
              </el-dialog>
            </div>

          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="Process Service Creator" name="second">
        <el-card>
          <div slot="header" class="clearfix">
            <span>WS4GEE OGC WPS Registration</span>
          </div>
          <el-form ref="form" :model="form" label-width="110px" label-position="right" class="wps">
            <el-form-item label="Script Path">
              <el-upload
                :on-success="handleAvatarSuccess"
                class="upload-demo"
                accept=".py"
                action="api/ws4gee/files/">
                <el-button size="small" type="primary">Upload models/functions scripts</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="Entrance">
              <el-input placeholder="Function (Entrance) Name" v-model="entranceFunc" clearable
                        size="small" style="width: 400px"></el-input>
            </el-form-item>
            <el-form-item label="Process Name">
              <el-input placeholder="Process Name" v-model="processName" clearable
                        size="small" style="width: 400px"></el-input>
            </el-form-item>
            <el-form-item label="Abstract">
              <el-input placeholder="Process Abstract" v-model="processAbstract" clearable
                        size="small" style="width: 400px"></el-input>
            </el-form-item>
            <el-form-item label="Title">
              <el-input placeholder="Process Title" v-model="processTitle" clearable
                        size="small" style="width: 400px"></el-input>
            </el-form-item>
            <el-divider>Default Input Parameters
              <el-tooltip class="item" effect="dark" :content="tipContent" placement="right">
                <el-button type="text" icon="el-icon-warning-outline" size="mini"></el-button>
              </el-tooltip>
            </el-divider>
            <el-form-item label="">
              <el-checkbox v-model="checked" @change="checkedChange">Use default input parameters</el-checkbox>
            </el-form-item>
            <el-form-item label="Input 1" v-if="checked">
              <el-input placeholder="export_scale" size="small" style="width: 200px" :disabled="false"></el-input>
              <el-input placeholder="Resolution in meters" size="small" style="width: 200px"
                        :disabled="!checked"></el-input>
              <el-input placeholder="float" size="small" style="width: 100px" :disabled="false"></el-input>
            </el-form-item>
            <el-form-item label="Input 2" v-if="checked">
              <el-input placeholder="export_bounds" size="small" style="width: 200px" :disabled="!checked"></el-input>
              <el-input placeholder="A vector region to export" size="small" style="width: 200px"
                        :disabled="!checked"></el-input>
              <el-input placeholder="Vector" size="small" style="width: 100px" :disabled="!checked"></el-input>
            </el-form-item>
            <el-divider>Input Parameters</el-divider>
            <el-form-item v-for="(item,index) in inputForm" :label="'Input '+(index+1)" :inline="true">
              <el-input v-model="item.name" placeholder="Input Parameter" size="small" style="width: 200px"></el-input>
              <el-input v-model="item.title" placeholder="Title" size="small" style="width: 200px"></el-input>
              <el-select v-model="item.type" placeholder="Type" size="small" style="width: 100px" @change="typeOptionsChange">
                <el-option
                  v-for="type in typeOptions"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value">
                </el-option>
              </el-select>
              <!-- For more input setting -->
              <el-input v-model="item.minOccurs" style="width: 100px" placeholder="minOccurs" size="small"></el-input>
              <el-input v-model="item.maxOccurs" style="width: 100px" placeholder="maxOccurs" size="small"></el-input>
              <el-input v-model="item.defaultValue" style="width: 100px" placeholder="DefaultValue"
                        size="small"></el-input>
              <el-form-item>
                <el-input v-model="item.abstract" placeholder="Abstract" size="small" style="width: 70%"></el-input>
              </el-form-item>
              <el-form-item :inline="true" label-position="left" v-if="item.type!='Vector' && item.type!='Raster'">
                <span>LiteralValuesChoice:  </span>
                <el-radio-group v-model="item.literalValuesChoice" defaul>
                  <el-radio :label="1">AnyValue</el-radio>
                  <el-radio :label="2">AllowedValues</el-radio>
                </el-radio-group>
                <el-input v-if="item.literalValuesChoice==2" v-model="item.literalValuesSetting"
                          placeholder="Allow Values Setting" size="small" style="width: 200px"></el-input>
                <span v-if="item.literalValuesChoice==2" class="demonstration">* add two or more items with ";". e.g. item1;item2</span>
              </el-form-item>
              <el-button type="success" size="small" icon="el-icon-plus" @click.prevent="addInputForm"></el-button>
              <el-button type="danger" size="small" icon="el-icon-delete"
                         @click.prevent="removeInputForm(item)"></el-button>
            </el-form-item>
            <el-divider>Output Parameters</el-divider>
            <el-form-item v-for="(item, index) in outputForm" :label="'Output'+(index+1)" :inline="true">
              <el-input v-model="item.name" placeholder="Output Parameter" size="small" style="width: 200px"></el-input>
              <el-input v-model="item.title" placeholder="Title" size="small" style="width: 200px"></el-input>
              <el-select v-model="item.type" placeholder="Type" size="small" style="width: 100px">
                <el-option
                  v-for="type in typeOptions"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value">
                </el-option>
              </el-select>
              <el-input v-model="item.abstract" placeholder="Abstract" size="small" style="width: 30%"></el-input>
              <el-button type="success" size="small" icon="el-icon-plus" @click.prevent="addOutputForm"></el-button>
              <el-button type="danger" size="small" icon="el-icon-delete"
                         @click.prevent="removeOutputForm(item)"></el-button>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item text-align="center">
              <el-button type="primary" @click="onSubmit" size="medium">Register</el-button>
              <el-button size="medium" @click="onReset">Reset</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>


</template>

<script>
import vkbeautify from "vkbeautify";

export default {
  name: "Registration",
  data() {
    return {
      // general setting
      activeName: 'first',
      form: {},
      typeOptions: [
        {
          value: "float",
          label: "float",
        },
        {
          value: "double",
          label: "double",
        },
        {
          value: "int",
          label: "int",
        },
        {
          value: "boolean",
          label: "boolean",
        },
        {
          value: "string",
          label: "string",
        },
        {
          value: "Vector",
          label: "Vector",
        },
        {
          value: "Raster",
          label: "Raster",
        },
        {
          value: "Text",
          label: "Text",
        },
      ],
      additionalInputDetailVisible: false,
      // process setting
      scriptPath: "",
      entranceFunc: "",
      entranceName: "",
      processName: "",
      processAbstract: "",
      processTitle: "",
      checked: true,
      tipContent: "Default input parameters were set to initialize functions with a raster output, if not required, click the checkbox to ignore it ",
      defaultForm: [{
        name: 'export_scale',
        title: 'scale to export the image; must exist if the process produces an image',
        type: 'float',
        abstract: '',
        minOccurs: '1',
        maxOccurs: '1',
        defaultValue: '30',
        literalValuesChoice: 1,
        literalValuesSetting: ''
      }, {
        name: 'export_bounds',
        title: 'boundary to export the image, if not exist, the downloading speed would be showed',
        type: 'Vector',
        abstract: '',
        minOccurs: '1',
        maxOccurs: '1',
        defaultValue: '',
        literalValuesChoice: 1,
        literalValuesSetting: ''
      }],
      inputForm: [{
        name: '',
        title: '',
        type: '',
        abstract: '',
        minOccurs: '',
        maxOccurs: '',
        defaultValue: '',
        literalValuesChoice: 1,
        literalValuesSetting: ''
      }],
      outputForm: [{
        name: '',
        title: '',
        type: '',
        abstract: '',

      }],

      //WCS registration
      dataForm: {
        dataset: '',
        service: 'WCS',
        stacking: 'by mean',
        daterange: '',
        options: [],
        bands: [],
        dataAbstract: '',
        keywords: '',
        uploadType: '',
        uploadBoundaryName: '',
        uploadBoundaryContent: '', // if locally, it should be a file name, or it is a URL to the resource, currently support .geojson
      },
      generateOptions: [
        {
          value: 'noCloud',
          label: 'no cloud'
        }, {
          value: 'byMonth',
          label: 'by month'
        }, {
          value: 'byYear',
          label: 'by year'
        }],
      datasetOptions: [
        {
          value: 'id1',
          label: 'Landsat 8 Surface Reflectance Tier 1',
          type: 'Raster'
        }
        // ,
        // {
        //   value: 'id2',
        //   label: 'Wuhan Polygon',
        //   type: 'Vector'
        // }
      ],
      tableData: [],
      groupName: "",
      newGroupName: "",
      moreOption: false,
      currentRow: null,
      editName: false,
      selectedData: '',
      coverageDialog: false,
      coverageInfoDialog: false,
      xmlInfoContent: '',
      xmlContent: '',
      xmlResult: ''
    }
  },
  methods: {

    generateOptionsChange(valueList) {
      if (valueList.length > 1) {
        let lastLndex = valueList.length - 1
        if (valueList[lastLndex] == 'byMonth') {
          const index = this.dataForm.options.indexOf('byYear');
          if (index > -1) { // only splice array when item is found
            this.dataForm.options.splice(index, 1); // 2nd parameter means remove one item only
          }
        } else if (valueList[lastLndex] == 'byYear') {
          const index = this.dataForm.options.indexOf('byMonth');
          if (index > -1) { // only splice array when item is found
            this.dataForm.options.splice(index, 1); // 2nd parameter means remove one item only
          }
        }
      }
    },
    checkedChange(value) {
      this.checked = value
    },
    //上传.py
    handleAvatarSuccess(res, file) {
      this.scriptPath = file.name;
      let index = file.name.lastIndexOf('.')
      this.entranceName = file.name.substr(0, index)
    },
    //上传boundary.geojson
    handleBoundaryAvatarSuccess(res, file) {
      this.dataForm.uploadBoundaryContent = file.name
    },

    //移除表单项事件
    removeInputForm(item) {
      let index = this.inputForm.indexOf(item)
      if (index !== 0) {
        this.inputForm.splice(index, 1)
      }
    },
    typeOptionsChange(value){
      console.log(value)
    },
    //添加表单项事件
    addInputForm() {
      this.inputForm.push({
        name: '',
        title: '',
        type: '',
        abstract: '',
        minOccurs: '',
        maxOccurs: '',
        defaultValue: '',
        literalValuesChoice: 1,
        literalValuesSetting: ''
      });
    },
    removeOutputForm(item) {
      let index = this.outputForm.indexOf(item)
      if (index !== 0) {
        this.outputForm.splice(index, 1)
      }
    },
    //添加表单项事件
    addOutputForm() {
      this.outputForm.push({
        name: '',
        title: '',
        type: '',
        abstract: '',
        minOccurs: '',
        maxOccurs: '',
        defaultValue: '',
        literalValuesChoice: 1,
        literalValuesSetting: ''
      });
    },
    onSubmit() {
      //下拉菜单
      this.$http({
        method: 'post',
        url: 'api/ws4gee/register',
        data: {
          script: this.scriptPath,
          entranceFunc: this.entranceFunc,
          entranceName: this.entranceName,
          processName: this.processName,
          processAbstract: this.processAbstract,
          processTitle: this.processTitle,
          checked: this.checked,
          defaultForm: JSON.stringify(this.defaultForm),
          inputForm: JSON.stringify(this.inputForm),
          outputForm: JSON.stringify(this.outputForm)
        }
      }).then(response => {
        let code = JSON.parse(response.data.replaceAll("\'", "\"")).code

        if (code == 0) {
          this.$alert('Success', 'Notification', {
            confirmButtonText: 'OK',
            callback: action => {
              this.$message({
                type: 'success ',
                message: `action: ${action}`
              });
              location.reload()
            }
          });
        } else {
          this.$alert('Failed', 'Notification', {
            confirmButtonText: 'OK',
            callback: action => {
              this.$message({
                type: 'error',
                message: `action: ${action}`
              });
            }
          });
        }
      }).catch(error => {
        console.log(error)
        this.$alert(error.message, 'Exception', {
          confirmButtonText: 'OK'
        });
      })
    },
    onReset() {
      location.reload()
    },

    handleCurrentClick(row) {
      this.$refs.singleTable.setCurrentRow(row);
      console.log(row.identifier)
      this.selectedData = row.identifier
    },

    handleCurrentChange(val) {
      this.currentRow = val;
    },
    datasetOptionChange() {
      let dataType = this.datasetOptions.find(item => item.value == this.dataForm.dataset).type
      if (dataType === 'Vector') {
        this.dataForm.service = 'WFS'
      } else {
        this.dataForm.service = 'WCS'
      }
    },

    callWCS(service) {
      let url = 'api/ows/' + this.groupName + '/wcs'

      if (service == 'getcapabilities') {
        this.$http({
          method: 'get',
          url: url,
          params: {
            service: 'WCS',
            version: '1.1.0',
            request: 'GetCapabilities'
          }
        }).then(response => {
          // console.log(response.data)
          this.coverageInfoDialog = true
          this.xmlInfoContent = vkbeautify.xml(response.data)
        })
      } else if (service == 'describecoverage') {
        if (this.selectedData === '') {
          return
        }
        this.$http({
          method: 'get',
          url: url,
          params: {
            service: 'WCS',
            version: '1.1.0',
            request: 'describecoverage',
            identifiers: this.selectedData
          }
        }).then(response => {
          // console.log(response.data)
          this.coverageInfoDialog = true
          this.xmlInfoContent = vkbeautify.xml(response.data)
        })
      } else if (service == 'getcoverage') {

        // if (this.selectedData === '') {
        //   return
        // }
        this.$http({
          method: 'get',
          url: 'api/ws4gee/generateCoverageRequest',
          params: {
            coverageName: this.selectedData
          }
        }).then(response => {
          this.loading = false
          this.coverageDialog = true
          this.xmlContent = vkbeautify.xml(response.data)
        })
      }
    },
    sendRequest() {
      let url = 'api/ows/' + this.groupName + '/wcs'
      this.$http({
        method: 'post',
        url: url,
        data: {
          xml: this.xmlContent
        }
      }).then(response => {
        this.xmlResult = vkbeautify.xml(response.data)
      })
    },
    onDataGenerationSubmit() {
      // console.log(this.dataForm.dataset, this.dataForm.service, this.dataForm.stacking, this.dataForm.daterange[0], this.dataForm.daterange[1],
      //   this.dataForm.options,
      //   this.dataForm.bands, this.dataForm.dataAbstract, this.dataForm.keywords, this.dataForm.uploadType, this.dataForm.uploadBoundaryContent)
      this.$http({
        method: 'post',
        url: 'api/test/',
        data: {
          serviceType: this.dataForm.service,
          datasetName: this.dataForm.dataset,
          stackingMethod: this.dataForm.stacking,
          start: this.dataForm.daterange[0],
          end: this.dataForm.daterange[1],
          options: this.dataForm.options,
          bands: this.dataForm.bands,
          dataAbstract: this.dataForm.dataAbstract,
          keywords: this.dataForm.keywords,
          uploadType: this.dataForm.uploadType,
          uploadBoundaryName: this.dataForm.uploadBoundaryName,
          uploadBoundaryContent: this.dataForm.uploadBoundaryContent
        }
      }).then(response => {
        console.info(response.data)
        this.tableData = []
        let data = JSON.parse(response.data.replaceAll("\'", "\"")).data
        for (let item in data.result) {
          this.tableData.push({'identifier': data.result[item]})
        }
        this.groupName = data.name
        console.log(this.groupName)

      })
    },

    setNewGroupName() {
      console.log(this.newGroupName === '')
      if (this.newGroupName) {
        console.log(this.newGroupName)
        this.$http({
          method: 'post',
          url: 'api/ws4gee/setGroupName',
          data: {
            groupName: this.groupName,
            newGroupName: this.newGroupName,
          }
        }).then(response => {
          console.info(response.data)
          let data = JSON.parse(response.data.replaceAll("\'", "\""))
          if (data.code == 0) {
            this.groupName = this.newGroupName
            this.editName = false
          }
        })

      }
    }

  }

}
</script>

<style scoped lang="stylus">
.containers {
  position: absolute;
  top: 60px;
  left: 10px;
  right: 0;
  bottom: 0px;
  background-color: #ffffff;
  width: 100%;
  height: 90%;

}

#registrationForm {
  width: 520px;
  color: #2c3e50;
  margin-top: 60px;
  margin-left: 500px;
  margin-right: 100px;
  /*border-style: solid;*/
  /*border-width: 1px;*/
  /*border-color: #000;*/
}

.new_tabs_header {
  /deep/ .el-tabs__header {
    margin-bottom 0;
  }
}


.wps {
  .el-form-item {
    margin-bottom: 0px;
    margin-top: 0px;
  }
}

.wcs {
  .el-form-item {
    margin-bottom: 5px;
    margin-top: 0px;
  }
}

.el-divider {
  margin: 10px;
}

.new_table_row {
  /deep/ .el-table__body tr.current-row > td.el-table__cell {
    background-color: #99a9bf;
  }

}

</style>
