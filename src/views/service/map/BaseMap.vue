<template>
  <div id="mapDiv">
    <div id="layer-switch">
      <el-tooltip
        class="item"
        effect="dark"
        content="图层管理器"
        placement="left"
      >
        <img
          src="../../../../static/img/layer-control.png"
          alt="图层管理"
          @click="changeLayerTreeShow"
        />
      </el-tooltip>
    </div>
    <div id="layerTree-container" v-show="isLayerTreeShow">
      <LayerTree
        :data="baseTreeItems"
        @selectChange="selectBaseChange"
        :isCheckAll="all"
      />
      <LayerTree
        :data="mapTreeItems"
        @selectChange="selectMapChange"
        :isCheckAll="empty"
      />
    </div>
    <button id="context" :style="{left: tranLeft, top: tranTop}" v-if="isContextShow" @click="getServiceByLocation">
      获取服务
    </button>
  </div>
</template>

<script>
  import "ol/ol.css";
  import {Map, View} from "ol";
  import {Tile as TileLayer, Vector as VectorLayer} from "ol/layer";
  import {XYZ, TileArcGISRest} from "ol/source";
  import {LocationWatch, CenterAt} from "../../../api/location";
  import LayerTree from "./LayerTree";
  import axios from "axios";
  import TileWMS from "ol/source/TileWMS";

  export default {
    name: "BaseMap",
    data() {
      return {
        clickCoordinate: null,
        tranLeft: 0,
        tranTop: 0,
        isContextShow: false,
        isLayerTreeShow: false,
        baseLayers: {},
        mapLayers: {},
        empty: [],
        baseTreeItems: [],
        mapTreeItems: [],
        tiandituKey: "60f62b68fd6bbe652ae59aeec34c78f0",
        tiandituData: [
          {
            type: 1,
            name: "天地图全球境界服务",
            url: "http://t3.tianditu.com/DataServer?T=ibo_w&x={x}&y={y}&l={z}",
            index: 1
          },
          {
            type: 1,
            name: "天地图地形注记服务",
            url: "http://t3.tianditu.com/DataServer?T=cta_w&x={x}&y={y}&l={z}",
            index: 2
          },
          {
            type: 1,
            name: "天地图地形渲染服务",
            url: "http://t3.tianditu.com/DataServer?T=ter_w&x={x}&y={y}&l={z}",
            index: 0
          },
        ],
        map: {},
        mapData: [{
          serviceName: "",
          serverType: "",
          serviceType:"",
          serviceUrl: "",
          layers: "",
          centerLongitude: 0,
          centerLatitude: 0
        }],
        all: ["allLayers"],
        selectSingleClick: null
      };
    },
    components: {LayerTree},
    methods: {
      initBase() {
        this.map = new Map({
          target: "mapDiv",
          view: new View({
            center: [114.31667, 30.51667],
            projection: "EPSG:4326",
            zoom: 8
          })
        });
        let children = [];
        for (let i = 0; i < this.tiandituData.length; i++) {
          let layer = this.tiandituData[i];
          let tileLayer;
          let name = layer.name;
          let url = layer.url;
          tileLayer = new TileLayer({
            title: name,
            source: new XYZ({
              crossOrigin: "anonymous",
              url: url + "&tk=" + this.tiandituKey
            })
          });
          if (tileLayer) {
            let key = i.toString();
            tileLayer.setZIndex(layer.index);
            this.baseLayers[key] = tileLayer;
            this.map.addLayer(tileLayer);
            let treeItem = {
              layerId: key,
              label: name
            };
            children.push(treeItem);
          }
        }
        this.baseTreeItems = [
          {
            layerId: "allLayers",
            label: "基础地图",
            children: children
          }
        ];
      },
      getMapByLocation(clickCoordinate) {
        axios({
          method: "get",
          url: "api/service/dataservice/location/" + clickCoordinate[0] + "/" + clickCoordinate[1]
        })
          .then(res => {
            if (res.data.data) {
              let children = [];
              for (let i = 0; i < res.data.data.length; i++) {
                let layer = res.data.data[i];
                let tileLayer;
                let name = layer.serviceName;
                let url = layer.serviceUrl;
                let layers = layer.layers;
                let serverType = layer.serverType;
                let className = layer.serviceType;
                if (layer.centerLongitude && layer.centerLatitude) {
                  layer.center = [layer.centerLongitude, layer.centerLatitude];
                } else {
                  layer.center = null;
                }
                let center = layer.center;
                if (serverType === "geoserver") {
                  tileLayer = new TileLayer({
                    title: name,
                    center: center,
                    source: new TileWMS({
                      url: url,
                      params: {LAYERS: layers, TILED: true},
                      serverType: "geoserver",
                    }),
                    visible: false,
                    className: className
                  });
                }
                if (serverType === "arcgisrest") {
                  let url = layer.serviceUrl;
                  tileLayer = new TileLayer({
                    title: name,
                    source: new TileArcGISRest({
                      crossOrigin: "anonymous",
                      url: url
                    }),
                    visible: false
                  });
                }
                if (tileLayer) {
                  let key = i.toString();
                  tileLayer.setZIndex(i + this.tiandituData.length);
                  this.mapLayers[key] = tileLayer;
                  this.map.addLayer(tileLayer);
                  tileLayer.setVisible(false);
                  let treeItem = {
                    layerId: key,
                    label: name
                  };
                  children.push(treeItem);
                }
              }
              this.mapTreeItems = [
                {
                  layerId: "allLayers",
                  label: "加载图层",
                  children: children
                }
              ];
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      changeLayerTreeShow() {
        this.isLayerTreeShow = !this.isLayerTreeShow;
      },

      selectBaseChange(layerId) {
        if (layerId === "allLayers") {
          let visibleCount = 0;
          let count = 0;
          for (let index in this.baseLayers) {
            if (this.baseLayers[index].getVisible()) {
              visibleCount++;
            }
            count++;
          }
          if (visibleCount === count) {
            this.updateBaseLayerVisibility(layerId, false);
          } else {
            this.updateBaseLayerVisibility(layerId, true);
          }
        } else {
          let layer = this.baseLayers[layerId];
          let state = layer.getVisible();
          state = !state;
          this.updateBaseLayerVisibility(layerId, state);
        }
      },

      updateBaseLayerVisibility(layerId, state) {
        switch (layerId) {
          case "allLayers":
            let children = this.baseTreeItems[0].children;
            for (let i = 0; i < children.length; i++) {
              this.setBaseLayerVisibility(children[i].layerId, state);
            }
            break;
          default:
            this.setBaseLayerVisibility(layerId, state);
            break;
        }
      },

      setBaseLayerVisibility(layerId, isVisible) {
        let layer = this.baseLayers[layerId];
        layer.setVisible(isVisible);
      },

      selectMapChange(layerId) {
        if (layerId === "allLayers") {
          let visibleCount = 0;
          let count = 0;
          for (let index in this.mapLayers) {
            if (this.mapLayers[index].getVisible()) {
              visibleCount++;
            }
            count++;
          }
          if (visibleCount === count) {
            this.updateMapVisibility(layerId, false);
          } else {
            this.updateMapVisibility(layerId, true);
          }
        } else {
          let layer = this.mapLayers[layerId];
          let state = layer.getVisible();
          state = !state;
          this.updateMapVisibility(layerId, state);
        }
      },

      updateMapVisibility(layerId, state) {
        switch (layerId) {
          case "allLayers":
            if (this.mapTreeItems && this.mapTreeItems.length > 0) {
              let children = this.mapTreeItems[0].children;
              for (let i = 0; i < children.length; i++) {
                this.setMapVisibility(children[i].layerId, state);
              }
            }
            break;
          default:
            this.setMapVisibility(layerId, state);
            break;
        }
      },

      setMapVisibility(layerId, isVisible) {
        let layer = this.mapLayers[layerId];
        layer.setVisible(isVisible);
        if (isVisible === true && layer.values_.center != null) {
          this.map.getView().setCenter(layer.values_.center)

        }
      },
      getServiceByLocation() {
        alert(this.clickCoordinate);
        this.isContextShow = false;
        this.updateMapVisibility("allLayers", false);
        this.mapTreeItems = [
          {
            layerId: "allLayers",
            label: "加载图层",
            children: []
          }
        ];
        this.getMapByLocation(this.clickCoordinate);
      },

      addMousePositionClick() {
        let that = this;
        this.map.on('singleclick', function (e) {
          // alert(e.coordinate);
          that.clickCoordinate = e.coordinate;
          that.tranLeft = (e.pixel[0] + 20) + 'px';
          that.tranTop = (e.pixel[1] + 50) + 'px';
          // 点击的时候显示或隐藏菜单
          that.isContextShow = !that.isContextShow;
        })
      },
    },
    mounted: function () {
      this.initBase();
      this.addMousePositionClick();
    }
  };
</script>

<style scoped lang="stylus">
  #myLoc {
    position: absolute;
    z-index: 2;
    bottom: 80px;
    left: 8px;
    visibility: hidden;
  }


  #myLoc img {
    width: 35px;

    .thematic-container {
      margin: 0;
      overflow: hidden;
      bottom: 0;
      right: 0;
      width: 100%;
      padding-top: 50px;
    }
  }

  .theme-box {
    margin: 3px 2px;
    -webkit-box-shadow: 0 1px 1px #c8c8c8;
    -moz-box-shadow: 0 1px 1px #c8c8c8;
    box-shadow: 0 1px 1px #c8c8c8;
    cursor: pointer;
    height: 2rem;
    text-align: center;
  }

  .theme-title {
    font-size: 0.8rem;
    color: #fff;
    height: 2rem;
    white-space: nowrap;
    padding-top: 0.6rem;
    width: 100%;
  }

  #thematicBox {
    position: absolute;
    top: 60px;
    left: 50px;
    z-index: 999;
    right: 0;
  }

  @media screen and (min-width: 1024px) {
    #mapDiv {
      width: 100%;
      height: 100%;
      padding: 50px 0 0 0;
      position: absolute;
    }

    #context {
      position: absolute;
      width: 70px;
      height: 20px;
      font-size 15px;
      background-color: #ffffff;
      box-shadow: 0 0 2px #8c939d;
      z-index: 1;
    }

    #layer-switch {
      position: absolute;
      z-index: 2;
      bottom: 2px;
      left: 10px;
    }

    #layer-switch img {
      width: 30px;
      background-size: 100% 100%;
      background-position: center;
    }

    #layer-mark {
      position: absolute;
      z-index: 2;
      bottom: 42px;
      left: 10px;
      display: flex;
      height: 40px;
      align-items: center;
    }

    #layer-mark img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
      background-size: 100% 100%;
      background-position: center;
    }

    #layerTree-container {
      position: absolute;
      bottom: 40px;
      left: 10px;
      width: 240px;
      z-index: 2;
      overflow: auto;
    }
  }

  @media screen and (max-width: 1024px) {
    #mapDiv {
      width: 100%;
      height: 100%;
      padding: 50px 0 0 0;
      position: absolute;
    }

    #context {
      position: absolute;
      width: 70px;
      height: 20px;
      font-size 15px;
      background-color: #ffffff;
      box-shadow: 0 0 2px #8c939d;
      z-index: 1;
    }

    #layer-switch {
      position: absolute;
      z-index: 2;
      bottom: 2px;
      left: 10px;
    }

    #layer-switch img {
      width: 30px;
      background-size: 100% 100%;
      background-position: center;
    }

    #layer-mark {
      position: absolute;
      z-index: 2;
      bottom: 42px;
      left: 10px;
      display: flex;
      height: 40px;
      align-items: center;
    }

    #layer-mark img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
      background-size: 100% 100%;
      background-position: center;
    }

    #layerTree-container {
      position: absolute;
      bottom: 40px;
      left: 10px;
      width: 240px;
      z-index: 2;
      overflow: auto;
    }
  }

  @media screen and (max-width: 800px) {
    #myLoc {
      visibility: visible;
    }
  }
</style>
