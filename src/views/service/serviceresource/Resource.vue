<template>
  <div class="container">
    <div class="section0">
      <el-row :gutter="20">
        <el-col :span="18">
          <el-select v-model="resourceType" placeholder="请选择数据类型" @change="setDataType" id="select-type">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input v-model="search" placeholder="请输入关键词" prefix-icon="el-icon-search" id="input-search"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button>搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="section1">
      <div v-if="resourceType==='WMS'">
        <el-row>
          <el-col>
            <div style="color: rgba(0,0,0,0.95); display: inline"><span
              style="font-size: larger">{{ layerCount|seperateNum }}</span>
              layer images have been found.
            </div>
            <div style="color: rgba(0,0,0,0.95);  display: inline"><span style="font-size: larger"> {{
                searchTime
              }}</span> seconds have
              been needed.
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-loading="loading">
          <el-col :span="4" v-for="layer in layerList" :key="layer.id">
            <div style="border: solid 1px black;">
              <el-popover
                placement="top-start" width="400" trigger="hover" :open-delay="openDelay" :close-delay="closeDelay">
                <el-card :body-style="{ padding: '0px' }">
                  <el-image :fit="fit" :src=layer.url class="image">
                    <div slot="error" class="image-slot" :style="{height: photoHeight}">
                      <el-image :src="require('@/assets/images/fail_to_load.jpg')"></el-image>
                    </div>
                  </el-image>
                  <div style="padding: 14px;">
                    <el-row>
                      <el-col><b>Name:</b>{{ layer.name }}</el-col>
                    </el-row>
                    <el-row>
                      <el-col><b>Title:</b>{{ layer.title }}</el-col>
                    </el-row>
                    <el-row>
                      <el-col><b>Attribution:</b>{{ layer.attribution|filterAttr }}</el-col>
                    </el-row>
                    <el-row>
                      <el-col><b>Topic:</b>{{ layer.topic }}</el-col>
                    </el-row>
                    <el-row>
                      <el-col><b>Keywords:</b>{{ layer.keywords|filterKeywords }}</el-col>
                    </el-row>
                    <el-divider></el-divider>
                    <el-row>
                      <el-col :span="4">
                        <el-button icon="el-icon-more" class="button" size="mini"
                                   @click="moreInfo(layer.id)"></el-button>
                      </el-col>
                      <el-col :span="4">
                        <el-button icon="el-icon-star-off" class="button" size="mini"></el-button>
                      </el-col>
                      <el-col :span="4">
                        <el-button icon="el-icon-delete" class="button" size="mini"></el-button>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
                <el-image :src=layer.url :fit="fit" slot="reference" ref="colWMSImage">
                  <div slot="error" class="image-slot" :style="{height: photoHeight}">
                    <el-image :src="require('@/assets/images/fail_to_load.jpg')"></el-image>
                  </div>
                </el-image>
              </el-popover>
              <div style="text-align: center"><span style="font-size: x-small">{{ layer.name|filterName }}</span></div>
            </div>
          </el-col>

        </el-row>
      </div>
      <div v-else-if="resourceType==='WFS'">
        <el-row>
          <el-col :span="5">
            <div style="color: rgba(0,0,0,0.95)"><span style="font-size: larger">{{ layerCount2|seperateNum }}</span>
              layer images have been found.
            </div>
          </el-col>
          <el-col :span="19">
            <div style="color: rgba(0,0,0,0.95)"><span style="font-size: larger"> {{ searchTime2 }}</span> seconds have
              been needed.
            </div>
          </el-col>
        </el-row>
        <el-row v-loading="loading">
          <el-col v-for="layer in layerList" :key="layer.id">
            <div class="dialogs">
              <div>
                <el-link><b style="color: rgba(0,0,0,0.95)">{{ layer.title }}</b></el-link>
              </div>
              <div>
                <i class="el-icon-discover"></i><span>Location:{{ layer.administrative_unit }}</span>
                <i
                  class="el-icon-location"></i><span>GeoGraphic Location:{{ layer.geoLocation|filterGeoLocation }}</span>
              </div>
              <div>Service was public at the website:
                <el-link :href=layer.url type="primary" target="_blank">{{ layer.url }}</el-link>
              </div>
              <div>{{ layer.abstr|filterAbstract }}</div>
              <div><b style="color: rgba(0,0,0,0.95)">Keywords:</b>{{ layer.keywords|filterKeywords }}</div>
              <!--              <div>-->
              <!--                <el-button type="text" style="color: #7299db"><u>添加到我的资源</u></el-button>-->
              <!--                <el-button type="text" style="color: #7299db"><u>从我的资源移除</u></el-button>-->
              <!--              </div>-->
              <el-divider></el-divider>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-else-if="resourceType==='WCS'">
        <el-alert title="暂无WCS数据" type="error" effect="dark"></el-alert>
      </div>
      <div v-else-if="resourceType==='WPS'">
<!--        <el-row>-->
<!--          <el-col :span="5">-->
<!--            <div style="color: rgba(0,0,0,0.95)"><span style="font-size: larger">{{ 5760|seperateNum }}</span>-->
<!--              layer images have been found.-->
<!--            </div>-->
<!--          </el-col>-->
<!--          <el-col :span="19">-->
<!--            <div style="color: rgba(0,0,0,0.95)"><span style="font-size: larger"> {{ searchTime2 }}</span> seconds have-->
<!--              been needed.-->
<!--            </div>-->
<!--          </el-col>-->
<!--        </el-row>-->
        <el-row v-loading="loading">
          <el-col v-for="layer in layerList" :key="layer.id">
            <div class="dialogs">
              <div>
                <el-link><b style="color: rgba(0,0,0,0.95)">{{ layer.identifier }}</b></el-link>
              </div>
              <div>Title:{{layer.title}}</div>
              <div>Abstraction:{{layer.abstr}}</div>
              <div>
<!--                <i class="el-icon-discover"></i><span>Location:{{ layer.administrative_unit }}</span>-->
<!--                <i-->
<!--                  class="el-icon-location"></i><span>GeoGraphic Location:{{ layer.geoLocation|filterGeoLocation }}</span>-->
              </div>
              <div>More details was available at:
                <el-link :href=layer.url type="primary" target="_blank">{{ layer.url }}</el-link>
              </div>
              <div><b style="color: rgba(0,0,0,0.95)">Keywords:</b>{{ layer.metadata}}</div>
              <!--              <div>-->
              <!--                <el-button type="text" style="color: #7299db"><u>添加到我的资源</u></el-button>-->
              <!--                <el-button type="text" style="color: #7299db"><u>从我的资源移除</u></el-button>-->
              <!--              </div>-->
              <el-divider></el-divider>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-else-if="resourceType==='SOAP'">
        <el-row v-loading="loading">
          <el-col v-for="layer in layerList" :key="layer.id">
            <div class="dialogs">
              <div>
                <el-link @click="moreInfoSOAP(layer.soapId)"><b style="color: rgba(0,0,0,0.95)">{{ layer.name }}</b></el-link>
              </div>
              <div>Title:{{layer.gisName}}</div>
              <div>Abstraction:{{layer.desr}}</div>
              <div>
                <!--                <i class="el-icon-discover"></i><span>Location:{{ layer.administrative_unit }}</span>-->
                <!--                <i-->
                <!--                  class="el-icon-location"></i><span>GeoGraphic Location:{{ layer.geoLocation|filterGeoLocation }}</span>-->
              </div>
              <div>More details was available at:
                <el-link :href=layer.ip type="primary" target="_blank">{{ layer.ip }}</el-link>
              </div>
              <!--              <div>-->
              <!--                <el-button type="text" style="color: #7299db"><u>添加到我的资源</u></el-button>-->
              <!--                <el-button type="text" style="color: #7299db"><u>从我的资源移除</u></el-button>-->
              <!--              </div>-->
              <el-divider></el-divider>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-else-if="resourceType==='Others'">
        <el-alert title="暂无Others数据" type="error" effect="dark"></el-alert>
      </div>
    </div>
    <div class="section2">
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[18]"
        :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="queryInfo.total"
        background id="pagination" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {Loading} from 'element-ui'

export default {
  name: "Resource",
  data() {
    return {
      layerCount: "68107",
      searchTime: 4.54,
      layerCount2: "25875",
      searchTime2: 0.53,
      openDelay: 300,
      closeDelay: 100,
      fit: "fill",
      search: '',
      options: [
        {
          value: 'WMS',
          label: 'WMS'
        },
        {
          value: 'WFS',
          label: 'WFS'
        }, {
          value: 'WCS',
          label: 'WCS'
        }, {
          value: 'WPS',
          label: 'WPS'
        }, {
          value: 'SOAP',
          label: 'SOAP'
        }, {
          value: 'Others',
          label: 'Others'
        }],
      resourceType: 'WMS',
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 18,
        total: 0
      },

      height: "200px",
      bannerHeight: 10,
      layerList: [
        // {"abstr":"National_Geochemical_Survey","topic":"geology","title":"National_Geochemical_Survey","attribution":"","keywords":"","name":"National_Geochemical_Survey","id":1,"url":"https://mrdata.usgs.gov/services/ngs?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&CRS=EPSG:4267&WIDTH=400&HEIGHT=200&LAYERS=National_Geochemical_Survey&BBOX=24.0,-165.0,73.0,-66.0&TRANSPARENT=TRUE&STYLES=&FORMAT=image/png"}
      ],
      loading: true,
    }

  },
  filters: {
    seperateNum(str) {
      let counter = 0;
      let result = "";
      for (let j = str.length - 1; j >= 0; j--) {
        counter++;
        result = str.charAt(j) + result;
        if (!(counter % 3) && j != 0) {
          result = ',' + result;
        }
      }
      return result;
    },
    filterAttr(str) {
      if (typeof (str) === "undefined") return "No attribution"
      if (str.trim() === "")
        return "No attribution"
      else
        return str
    },
    filterKeywords(str) {
      if (typeof (str) === "undefined") return "No attribution"
      if (str.trim() === "")
        return "No keywords"
      else
        return str
    },
    filterAbstract(str) {
      if (str.trim() === "")
        return "There is no abstract in the service capability document."
      else
        return str
    },
    filterGeoLocation(list) {
      return list[0].toString() + ", " + list[1].toString()
    },
    filterName(name) {
      if (typeof (name) === "undefined") return "No name"
      if (name.trim() === "")
        return "No name"
      else if (name.length > 20) {
        return name.substring(0, 16) + "......"
      } else {
        return name
      }

    }
  },
  computed: {
    photoHeight: function () {
      this.$nextTick(function () {
        let el = this.$refs.colWMSImage[0].$el;
        console.log(el)
      })

    }
  },
  mounted() {
    this.setWMSLayerList(1)

  },
  methods: {
    init() {
      this.resourceType = "WMS"

    },

    handleCurrentChange(val) {
      if (this.resourceType == 'WMS') {
        this.setWMSLayerList(val)
      } else if (this.resourceType == 'WFS') {
        this.setWFSLayerList(val)
      } else if (this.resourceType == 'WCS') {

      } else if (this.resourceType == 'WPS') {
        this.setWPSList(val)
      } else if (this.resourceType == 'SOAP') {
        this.setSOAPList(val)
      } else if (this.resourceType == 'Others') {

      }
    },
    setWMSLayerList(pageNum) {
      this.loading = true
      this.layerList = []
      this.queryInfo.pagenum = pageNum

      // console.log(this.loading)
      this.$http({
        method: "get",
        url: "api/resource/getWMSLayer?pageNum=" + pageNum + "&pageSize=18"
      }).then(response => {
        let result = response.data.data.data
        const len = result.length
        this.queryInfo.total = response.data.data.totalSize
        for (let i = 0; i < len; i++) {
          let layer = result[i]
          layer.url = "data:image/png;base64," + layer.photo
          this.layerList.push(layer)
        }
        // console.log(this.layerList)
        this.loading = false
      })


    },
    setWFSLayerList(pageNum) {
      this.loading = true
      this.layerList = []
      this.queryInfo.pagenum = pageNum
      this.$http({
        method: "get",
        url: "api/resource/getWFS?pageNum=" + pageNum + "&pageSize=10"

      }).then(response => {
        const result = response.data.data.data
        const len = result.length
        this.queryInfo.total = response.data.data.totalSize
        for (let i = 0; i < len; i++) {
          let layer = result[i]
          this.layerList.push(layer)
        }
        this.loading = false
      })

    },
    setWPSList(pageNum){
      this.loading = true
      this.layerList = []
      this.queryInfo.pagenum = pageNum
      this.$http({
        method: "get",
        url: "api/resource/getWPS?pageNum=" + pageNum + "&pageSize=10"

      }).then(response => {
        const result = response.data.data.data
        const len = result.length
        this.queryInfo.total = response.data.data.totalSize
        for (let i = 0; i < len; i++) {
          let layer = result[i]
          this.layerList.push(layer)
        }
        this.loading = false
      })
    },
    setSOAPList(pageNum){
      this.loading = true
      this.layerList = []
      this.queryInfo.pagenum = pageNum
      this.$http({
        method: "get",
        url: "api/resource/getSOAP?pageNum=" + pageNum + "&pageSize=10"

      }).then(response => {
        const result = response.data.data.data
        const len = result.length
        this.queryInfo.total = response.data.data.totalSize
        for (let i = 0; i < len; i++) {
          let layer = result[i]
          this.layerList.push(layer)
        }
        this.loading = false
        console.log(this.layerList)
      })
    },
    setDataType(curType) {
      this.resourceType = curType
      if (curType === 'WFS') {
        this.setWFSLayerList(1)
      } else if (curType === 'WMS') {
        this.setWMSLayerList(1)
      } else if (curType==='WPS'){
        this.setWPSList(1)
      }else if (curType==='SOAP'){
        this.setSOAPList(1)
      }
    },
    moreInfo(id) {
      //打开新窗口
      let routeData = this.$router.resolve({
        path: "ResourceDetail",
        query: {
          id: id,
          type: 'WMS'
        }
      });
      window.open(routeData.href, "_blank");

    },

    moreInfoSOAP(soapId){
      let routeData = this.$router.resolve({
        path: "ResourceDetail",
        query: {
          id: soapId,
          type: 'SOAP'
        }
      });
      window.open(routeData.href, "_blank");
    }
  }

}
</script>

<style scoped lang="stylus">
.container {
  position absolute
  top 70px
  left 30px
  right 30px
  bottom 30px
  overflow hidden
  background white

  .section0 {
    height 5%
    margin 20px
  }

  .section1 {
    height 80%
    min-width 50%
    margin-left 20px
    margin-right 20px
    overflow-y: auto
    overflow-x: hidden


  }

  .section2 {
    height 15%
    text-align center
    margin 20px

  }

  .el-col {
    border-radius: 2px;
    margin-bottom: 20px;
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
