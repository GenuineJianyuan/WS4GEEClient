<template>
  <div id="earth">
    <vc-viewer ref="vcViewer" style="overflow: hidden; position: absolute" @ready="ready" :camera="camera">
      <!--      <template v-for="(item, index) in positionsParabola">-->
      <!--        <vc-trail-polyline-->
      <!--          :key="'parabola' + index"-->
      <!--          :positions="item"-->
      <!--          color="yellow"-->
      <!--          :imageUrl=imageUrl-->
      <!--          :width="5"-->
      <!--          ref="parabola"-->
      <!--        ></vc-trail-polyline>-->
      <!--      </template>-->
      <!--      <template v-for="(item, index) in points">-->
      <!--        <vc-entity :position="item">-->
      <!--          <vc-graphics-point-->
      <!--            :key="index"-->
      <!--            color="RED"-->
      <!--            :pixelSize="10"-->
      <!--            :disableDepthTestDistance="Number.POSITIVE_INFINITY"-->
      <!--          ></vc-graphics-point>-->
      <!--        </vc-entity>-->
      <!--        <vc-collection-primitive-label :labels="labels">  </vc-collection-primitive-label>-->
      <!--      </template>-->
      <vc-collection-primitive-point v-if="curType==='server'&&show===true">
        <template v-for="(position) of curPositions">
          <vc-primitive-point
            :position="position"
            :color="serverPoint"
            :pixelSize="8"
            @click="clicked"
            @mouseover="enter"
          ></vc-primitive-point>
        </template>
      </vc-collection-primitive-point>
      <vc-collection-primitive-point v-if="curType==='service'">
        <template v-for="(position) of curPositions">
          <vc-primitive-point
            :position="position"
            :color="servicePoint"
            :pixelSize="8"
            @click="clicked"
            @mouseover="enter"
          ></vc-primitive-point>
        </template>
      </vc-collection-primitive-point>
      <vc-overlay-html :position="curPosition" v-if="visible" :pixel-offset="{x: 0, y: 0}">
        <div class="vc-box" v-if="curType==='server'" v-model="curServer">
          <div><b>服务器信息</b></div>
          <div>坐标：{{this.curPosition.lng}},{{this.curPosition.lat}}</div>
          <div>位置：{{this.curPosition.stateorprovince}}</div>
          <div>服务数量：{{this.curPosition.servicenum}}</div>
          <div>IP：{{this.curPosition.ip}}</div>
          <div>
            <el-button type="primary" @click="visible = false">确 定</el-button>
            <el-button @click="visible = false">取 消</el-button>
          </div>
        </div>
        <div class="vc-box" v-else-if="curType==='service'">
          <div>服务名称：</div>
          <div>描述：</div>
          <div>
            <el-button type="primary" @click="visible = false">确 定</el-button>
            <el-button @click="visible = false">取 消</el-button>
          </div>
        </div>
      </vc-overlay-html>
      <vc-layer-imagery>
        <vc-provider-imagery-tianditu mapStyle="img_c"
                                      token="436ce7e50d27eede2f2929307e6b33c0"></vc-provider-imagery-tianditu>
      </vc-layer-imagery>
    </vc-viewer>
    <el-row class="toolbar">
      <el-button type="danger" round @click="selectType('server')">服务器分布</el-button>
<!--      <el-button type="danger" round @click="selectType('service')">服务分布</el-button>-->
      <el-button type="danger" round @click="reload">重载</el-button>
    </el-row>
  </div>
</template>

<script>
import url from "../../../assets/images/colors.png"

const lat = 30.598026044
const lng = 114.302312702
export default {
  name: "DigitalEarth",
  data() {
    return {
      curType: "server",
      loading: true,
      labels: [],
      animation: false,
      camera: {
        position: {lng: 114.3055, lat: 30.5928, height: 17000000},
        heading: 10,
        pitch: -90,
        roll: -10
      },
      curPositions: [],
      curPosition: {},
      serverPoint: {},
      servicePoint: {},
      visible: false,
      show:false,
      curServer:{}

    }
  },
  created() {
    // const { points, center, positionsParabola} = this
    // for (let i = 0; i < points.length-1; i++) {
    //   const positions = this.parabolaEquation({ startPoint: points[i], endPoint: points[i+1], height: 100000, num: 100 })
    //   positionsParabola.push(positions)
    // }
  },
  mounted() {
    // const promises = []
    // this.$refs.parabola.forEach((v) => {
    //   promises.push(v.createPromise)
    // })
    //
    // Promise.all([this.$refs.parabola.createPromise, ...promises]).then((e) => {
    //   Promise.all(e.map(v => v.cesiumObject.createPromise)).then(() => {
    //     const {Cesium, viewer} = this.cesiumInstance
    //     viewer.zoomTo(viewer.entities)
    //   })
    // })
  },
  methods: {
    ready(cesiumInstance) {
      this.cesiumInstance = cesiumInstance
      const {Cesium, viewer} = cesiumInstance
      this.serverPoint = Cesium.Color.fromCssColorString('rgb(0,64,255)')
      this.servicePoint = Cesium.Color.fromCssColorString('rgb(255,0,30)')
    },
    clicked(e) {
      this.visible = true
      this.curPosition = this.curPositions[e.cesiumObject._index]
      this.curServer={lng:this.curPosition.lng,lat:this.curPosition.lat,ip:this.curPosition.ip,serviceCount:this.curPosition.servicenum,location:this.curPosition.stateorprovince}
    },
    enter() {
      //设置鼠标形状
    },
    selectType(type) {
      this.visible=false
      this.show=!this.show
      this.curType = type
      if (type == 'server') {
        // 获取当前服务器位置
        this.$http({
          method: "get",
          url: "api/resource/getDomain"
        }).then(response => {
          let result = response.data.data.data
          console.log(result.length)
          for (let i=0;i<502;i++ ){
            let curServer= result[i]
            curServer.lng=curServer.longitude
            curServer.lat=curServer.latitude

            this.curPositions.push(curServer)
            //
          }
          // console.log(this.curPositions)
          // this.curPositions = [{lng: 114.3055, lat: 30.5928}, {lng: 116.3055, lat: 30.5928}, {lng: 114.3055,lat: 32.5928}, {lng: 115.3055, lat: 34.7928}]
          // console.log(this.curPositions)
        })


      } else if (type == 'service') {
        this.visible = false
        this.curPositions = [{lng: 114.3055, lat: 30.5928}]
      }

      this.curPosition = {lng: 114.3055, lat: 30.5928, height: 118}
    },
    reload() {
      this.loading = true
      this.curType = ""
      this.$refs.vcViewer.reload().then(e => {
        console.log(e)
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="stylus">

#earth
  position absolute
  top 50px
  left 0px
  right 0px
  bottom 0px
  background-color black

  .vc-box {
    line-height: 30px;
    background-color: #fff;
    border-color black
    color: black;
    padding: 8px 16px;
    min-width: 300px
    max-height: 400px
    max-width: 500px;
    overflow-y: auto
  }

  .toolbar {
    left: 30px
    top: 10px
  }


</style>
