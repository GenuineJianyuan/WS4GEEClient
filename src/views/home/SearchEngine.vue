<template>
  <div class="container">
    <div class="section0">
      <el-row>
        <el-col :span="5">
          <div style="font-size:25px;margin-bottom: 20px;color: rgba(0,0,0,0.95)">Resource Preview</div>
        </el-col>
        <el-col>
          <el-divider></el-divider>
        </el-col>
        <el-col>
          <el-form :inline="true" :model="searchForm">
            <el-form-item>
              <el-select v-model="searchForm.type" @change="setDataType" id="select-type"
                         collapse-tags size="small">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchForm.text" placeholder="Search Keyword" size="small"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search" size="small">Search</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="section1">
      <div class="table-container">
        <el-table :data="tableData" style="width: 100%;" :cell-style="{padding: '5'}" :height="450">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="type" label="Type" width="120"></el-table-column>
          <el-table-column prop="name" label="Title" width="200"></el-table-column>
          <el-table-column prop="group" label="Group" width="200" v-if="searchForm.type=='WCS'"></el-table-column>
          <el-table-column prop="desr" label="Abstract" show-overflow-tooltip></el-table-column>
          <el-table-column label="Operation" width="280">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="callWCS(scope.$index, scope.row)" style="color: #7299db"  v-if="searchForm.type=='WCS'">get coverage</el-button>
              <el-button size="mini" type="text" @click="handlePreview(scope.$index, scope.row)" style="color: #7299db"
                         v-if="searchForm.type=='WCS'">
                preview
              </el-button>
              <el-button size="mini" type="text" @click="handleDetail(scope.$index, scope.row)" style="color: #7299db">
                more details
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="GetCoverage" :visible.sync="coverageDialog"
                   :close-on-click-modal="false">
          <el-input type="textarea" :rows="10" resize="none" v-model="coverageXmlContent"></el-input>
          <span>Result:</span>
          <el-input type="textarea" :rows="10" resize="none" v-model="coverageXmlResult"></el-input>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sendRequest">Submit</el-button>
            <el-button @click="coverageDialog = false">Cancel</el-button>
          </div>
        </el-dialog>
        <el-dialog title="Preview" :visible.sync="previewDialog" width="40%">
          <div id="map"></div>
          <div>* Preview through Geemap is coming soon</div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="previewDialog = false">Close</el-button>
          </div>
        </el-dialog>
        <el-dialog title="More Details" :visible.sync="resultDialog">
          <el-input type="textarea" :rows="20" resize="none" v-model="xmlResult">
          </el-input>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="resultDialog = false">Close</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <div class="section2">
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[10]"
        :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="queryInfo.total"
        background id="pagination" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import vkbeautify from "vkbeautify";
import  {Tile as TileLayer} from "ol/layer";
import {Map, View} from "ol"
import XYZ from "ol/source/XYZ"
import OSM from 'ol/source/OSM'
// import GeoTIFF  from 'ol/source/GeoTIFF';


export default {
  name: "SearchEngine",
  data() {
    return {
      img_default: require('@/assets/default.jpg'),

      searchForm: {
        time: '',
        type: 'WCS',
        text: ''
      },
      activeNames: ["1"],
      tableData: [
        {
          id: 'u1',
          name: '??????1',
          type: 'WMS',
          desr: '??????????????????????????????WMS??????????????????XXXXXXXX???????????????XXXXXXXXXXXXXXXXXXXXXXXX',
          group: '2021-11-20'
        }
      ],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
        total: 0
      },
      total: 0,
      resourceType: "All",
      options: [
        {
          value: 'WCS',
          label: 'WCS'
        }, {
          value: 'WPS',
          label: 'WPS'
        }],
      xmlResult: '',
      coverageDialog:false,
      curGroupName:'',
      coverageXmlContent:'',
      coverageXmlResult:'',
      resultDialog: false,
      previewDialog: false,
      count: 0

    }
  },
  mounted() {
    this.getServices(this.searchForm.type)
  },
  methods: {
    initMap() {
      new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          projection: "EPSG:4326",
          center: [103.3, 35.5],
          zoom: 4
        })
      })
    },
    callWCS(index, row){
      this.$http({
        method: 'get',
        url: 'api/ws4gee/generateCoverageRequest',
        params: {
          coverageName: row.name
        }
      }).then(response => {
        this.coverageDialog = true
        this.curGroupName=row.group
        this.coverageXmlContent = vkbeautify.xml(response.data)
      })
    },
    sendRequest(){
      let url = 'api/ows/' + this.curGroupName + '/wcs'
      this.$http({
        method: 'post',
        url: url,
        data: {
          xml: this.coverageXmlContent
        }
      }).then(response => {
        this.coverageXmlResult = vkbeautify.xml(response.data)
      })
    },
    getServices(serviceType) {
      this.tableData = []
      if (serviceType === 'WCS') {
        this.$http({
          method: 'get',
          url: 'api/ws4gee/WCSService'
        }).then(response => {
          const result = JSON.parse(response.data.replaceAll("\'", "\""))
          if (result.code === 0) {
            const WCSList = result.data
            for (let item in WCSList) {
              let curWCS = WCSList[item]
              this.tableData.push(
                {
                  id: curWCS.name,
                  name: curWCS.name,
                  type: curWCS.type,
                  desr: curWCS.abstract,
                  group: curWCS.group,
                  groupId: curWCS.groupId
                }
              )
            }
          }
        })
      } else if (serviceType === 'WPS') {
        this.$http({
          method: 'get',
          url: 'api/ws4gee/WPSService'
        }).then(response => {
          const result = JSON.parse(response.data.replaceAll("\'", "\""))
          if (result.code === 0) {
            const WPSList = result.data
            for (let item in WPSList) {
              let curWPS = WPSList[item]
              this.tableData.push(
                {
                  id: curWPS.id,
                  name: curWPS.name,
                  title: curWPS.title,
                  type: curWPS.type,
                  desr: curWPS.abstract
                }
              )
            }
          }
        })
      }
    },
    handleCurrentChange() {

    },
    setDataType() {
      this.getServices(this.searchForm.type)
    },
    handleDetail(index, row) {
      this.resultDialog = true
      this.xmlResult=""
      if (row.type === 'WCS') {
        let url = 'api/ows/' + row.group + '/wcs'
        this.$http({
          method: 'get',
          url: url,
          params: {
            service: 'WCS',
            version: '1.1.0',
            request: 'describecoverage',
            identifiers: row.id
          }
        }).then(response => {
          this.xmlResult = response.data
        })
      } else if (row.type === 'WPS') {
        let url = 'api/ws4gee/wps'
        this.$http({
          method: 'get',
          url: url,
          params: {
            request: 'DescribeProcess',
            service: 'WPS',
            version: '1.1.0',
            identifier: row.name,
            id: row.id
          }
        }).then(response => {
          this.xmlResult = response.data
        })
      }

    },
    handlePreview(index, row) {
      this.previewDialog = true
      if (this.count == 0) {
        this.$nextTick(() => {
          this.initMap()
        })
      }
      this.count = +1 // solve this issue
    }
    ,
    // handleCurrentClick(row, column, event) {
    //   this.$refs.singleTable.setCurrentRow(row);
    //   console.log(row.identifier)
    // }
    // ,
    setRowStyle(row) {
      if (row.row.isPart == true) {
        return 'color:red;'
      }
    }
    ,
    moreOptions() {
      this.moreOption = true
    },

    search() {
      this.$alert('Coming soon', 'Message', {
        confirmButtonText: 'OK',
      });
    }
  }
}
</script>

<style scoped lang="stylus">
.container {
  position absolute
  top: 60px
  left: 10px
  right: 0
  bottom: 0px
  overflow hidden
  background white
  width: 100%
  height: 90%

  .section0 {
    height 20%
    margin 20px
  }

  .section1 {
    height 60%;
    min-width 50%;
    margin-left 20px;
    margin-right 20px;
    overflow-y: hidden;
    overflow-x: hidden;
  }

  .section2 {
    height 20%
    text-align center
    margin 20px

  }

  #map {
    height: 300px;
    width: 100%
  }

  .dialogs {
    div {
      margin-bottom: 5px;
      font-size: smaller

      i {
        margin-right: 2px
      }

      span {
        margin-right: 20px
      }
    }
  }
}

</style>
