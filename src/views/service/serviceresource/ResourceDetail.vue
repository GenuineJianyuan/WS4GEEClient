<template>
  <div class="container">
    <div class="section0">
      <el-row>
        <el-col :span="5" style="margin-bottom: 0px">
          <div style="color: rgba(0,0,0,0.95)"><span style="font-size: x-large"> <strong>页面详情</strong></span></div>
        </el-col>
        <el-col style="margin-bottom: 0px">
          <el-divider></el-divider>
        </el-col>
      </el-row>
    </div>
    <div class="section1">
      <div v-if="serviceType==='WMS'">
        <div><h3 style="color: black;margin-bottom: 10px">页面信息</h3></div>
        <div class="dialogs">
          <div style="left: 20px"><i class="el-icon-price-tag"></i><b>Name:</b>{{ data.name }}</div>
          <div><i class="el-icon-document"></i><b>Abstract:</b>{{ data.abstr|filterStr }}</div>
          <div><i class="el-icon-reading"></i><b>Title:</b>{{ data.title }}</div>
          <div><i class="el-icon-discover"></i><b>Projection:</b>{{ data.projection }}</div>
          <div><i class="el-icon-location-outline"></i><b>Boundary Box:</b>{{ data.xmin }},{{ data.ymin }},{{
              data.xmax
            }},{{ data.ymax }}
          </div>
          <div><i class="el-icon-chat-line-square"></i><b>Keywords:</b>{{ data.keywords }}</div>
          <el-image :src="data.url" style="border: solid 1px black">
            <div slot="error" class="image-slot">
              <el-image :src="require('@/assets/images/fail_to_load.jpg')"></el-image>
            </div>
          </el-image>
          <div>
          <span>
            <i class="el-icon-link"></i>
            <b>Url:</b>
            <el-link :href=data.url target="_blank" style="color: #7299db">
                {{ data.url }}
            </el-link>
        </span>
          </div>
        </div>
        <div><h3 style="color: black;margin-bottom: 10px; margin-top: 30px">所在服务信息</h3></div>
        <div class="dialogs">
          <div>
            <i class="el-icon-discover"></i><span><b>Location:</b>{{ serviceData.administrativeUnit }}</span>
            <i class="el-icon-location"></i><span><b>GeoGraphic Location:</b>
            {{ serviceData.geoLocation[0] }},{{ serviceData.geoLocation[1] }}
          </span>
          </div>
          <div><i class="el-icon-document"></i><b>Abstration:</b>{{ serviceData.abstr }}</div>
          <div><i class="el-icon-user"></i><b>Domain:</b>{{ serviceData.domain }}</div>
          <div><span> <i class="el-icon-link"></i><b style="color: rgba(0,0,0,0.95)">Url:</b>
            <el-link :href=serviceData.url target="_blank" style="color: #7299db">
              {{ serviceData.url }}
            </el-link></span></div>
        </div>
      </div>
      <div v-else-if="serviceType==='SOAP'">
        <div><h3 style="color: black;margin-bottom: 10px">服务信息</h3></div>
        <div class="dialogs">
          <div style="left: 20px"><i class="el-icon-price-tag"></i><b>Name:</b>{{ serviceData.name }}</div>
          <div><i class="el-icon-document"></i><b>Abstract:</b>{{ serviceData.desr|filterStr }}</div>
          <div><i class="el-icon-reading"></i><b>Title:</b>{{ serviceData.gisName }}</div>
          <div>
          <span>
            <i class="el-icon-link"></i>
            <b>Url:</b>
            <el-link :href=serviceData.ip target="_blank" style="color: #7299db">
                {{ serviceData.ip }}
            </el-link>
        </span>
          </div>
        </div>
        <div><h3 style="color: black;margin-bottom: 10px; margin-top: 30px">参数信息</h3></div>
        <div class="dialogs">
                    <div v-for="param in data" :key="param.paramId">
                      <div><i class="el-icon-help"></i><b>Name:</b>{{ serviceData.name }}</div>
                      <div><i class="el-icon-document"></i><b>Description:</b>{{ param.desr }}</div>
                      <div><i class="el-icon-collection-tag"></i><b>Type:</b>{{ param.paramType }}</div>
                      <div><i class="el-icon-tickets"></i><b>Input/Output:</b>
                        <el-tag type="" size="mini" v-if="param.useType==='input'">{{ param.useType }}</el-tag>
                        <el-tag type="warning" size="mini" v-else-if="param.useType==='output'">{{ param.useType }}</el-tag>
                      </div>
                      <el-divider></el-divider>
                    </div>
        </div>
      </div>
    </div>

    <div class="section2">
      <!--      <el-pagination-->
      <!--        :current-page="queryInfo.pagenum"-->
      <!--        :page-sizes="[10, 20, 50]"-->
      <!--        :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"-->
      <!--        background id="pagination">-->
      <!--      </el-pagination>-->
    </div>
  </div>
</template>

<script>
export default {
  name: "ResourceDetail",
  data() {
    return {
      serviceType: "",
      layerId: "",
      activeNames: ["1"],
      data: null,
      serviceData: null
    }
  },
  filters: {
    filterStr(str) {
      if (str.trim() === "") return "No Info"
      return str;
    },
  },
  created() {
    this.layerId = this.$route.query.id
    this.serviceType = this.$route.query.type

  },
  mounted() {
    this.setInfo(this.layerId, this.serviceType)
  },
  methods: {
    setInfo(layerId, type) {
      if (type == 'WMS') {
        this.setWMSLayerInfo(layerId)
      } else if (type === 'SOAP') {
        this.setSOAPInfo(layerId)
      }
    },
    setWMSLayerInfo(layerId) {
      this.$http({
        method: "get",
        url: "api/resource/getWMSLayer?id=" + layerId
      }).then(response => {
        let result = response.data.data.data
        this.data = result[0]
        console.log(this.data)
        this.$http({
          method: "get",
          url: "api/resource/getWMS?id=" + this.data.serviceId
        }).then(response => {
          let result = response.data.data.data
          this.serviceData = result[0]
          // console.log(this.serviceData)
        })
      })

    },
    setSOAPInfo(soapId) {
      this.$http({
        method: "get",
        url: "api/resource/getSOAP?soapId=" + soapId
      }).then(response => {
        let result = response.data.data.data
        this.serviceData = result[0]
      })

      this.$http({
        method: "get",
        url: "api/resource/getParam?soapId=" + soapId
      }).then(response => {
        let result = response.data.data.data
        console.log(result)

        this.data = result
      })
    },
    search() {

    },
    setDataType(curType) {
      this.resourceType = curType
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
    height 10%
    margin-left 20px
    margin-top 20px

  }

  .section1 {
    height 85%
    min-width 50%
    margin-left 20px
    margin-right 20px
    overflow-y: auto
    overflow-x: hidden
  }

  .section2 {
    height 5%
    text-align center
    margin 20px

  }


  .dialogs {
    left: 100px;

    div {
      margin-bottom: 5px;
      font-size: smaller

      i {
        margin-right: 2px
      }

      b {
        color black
      }

      span {
        margin-right: 20px
      }
    }
  }

}
</style>

