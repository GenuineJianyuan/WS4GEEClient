<template>
  <el-row class="wrap" style="background-color: #bfc1c929">
    <el-col :span="20" :style="{ height: myHeight + 'px' }" class="wrap-left">
      <div id="mapDiv">
        <div id="service-info" v-show="isServiceinfoShow">
          <div style="height: 50px; width: 100%">
            <el-col :span="4">
              <div class="infoTitle">layer name:</div>
            </el-col>
            <el-col :span="14">
              <el-form class="infoTextBox">
                <el-input class="infoText" v-model="layerService.layerName"/>
              </el-form>
            </el-col>
            <el-col :span="6">
              <el-form class="infoButtonBox">
                <el-button class="infoButton" @click="addMapLayer(layerService)">add to layers</el-button>
              </el-form>
            </el-col>
          </div>
          <div style="height: 50px; width: 100%">
            <el-col :span="4">
              <div class="infoTitle">service name:</div>
            </el-col>
            <el-col :span="4">
              <el-form class="infoTextBox">
                <el-input class="infoText" v-model="layerService.serviceName"/>
              </el-form>
            </el-col>
            <el-col :span="4">
              <div class="infoTitle" style="padding-left: 10px">service type:</div>
            </el-col>
            <el-col :span="4">
              <el-form class="infoTextBox">
                <el-input class="infoText" v-model="layerService.serviceType"/>
              </el-form>
            </el-col>
            <el-col :span="4">
              <div class="infoTitle" style="padding-left: 10px">server type:</div>
            </el-col>
            <el-col :span="4">
              <el-form class="infoTextBox">
                <el-input class="infoText" v-model="layerService.serverType"/>
              </el-form>
            </el-col>
          </div>
          <div style="height: 50px; width: 100%">
            <el-col :span="4">
              <div class="infoTitle">service url:</div>
            </el-col>
            <el-col :span="20">
              <el-form class="infoTextBox">
                <el-input class="infoText" v-model="layerService.serviceUrl"/>
              </el-form>
            </el-col>
          </div>
          <div style="height: 50px; width: 100%">
            <el-col :span="4">
              <div class="infoTitle">min longitude:</div>
            </el-col>
            <el-col :span="8">
              <el-form class="infoTextBox">
                <el-input class="infoText" v-model="layerService.minLongitude"/>
              </el-form>
            </el-col>
            <el-col :span="4">
              <div class="infoTitle" style="padding-left: 10px">max longitude:</div>
            </el-col>
            <el-col :span="8">
              <el-form class="infoTextBox">
                <el-input class="infoText" v-model="layerService.maxLongitude"/>
              </el-form>
            </el-col>
          </div>
          <div style="height: 50px; width: 100%">
            <el-col :span="4">
              <div class="infoTitle">min latitude:</div>
            </el-col>
            <el-col :span="8">
              <el-form class="infoTextBox">
                <el-input class="infoText" v-model="layerService.minLatitude"/>
              </el-form>
            </el-col>
            <el-col :span="4">
              <div class="infoTitle" style="padding-left: 10px">max latitude:</div>
            </el-col>
            <el-col :span="8">
              <el-form class="infoTextBox">
                <el-input class="infoText" v-model="layerService.maxLatitude"/>
              </el-form>
            </el-col>
          </div>
          <div style="height: 50px; width: 100%">
            <el-col :span="4">
              <div class="infoTitle">download url:</div>
            </el-col>
            <el-col :span="14">
              <el-form class="infoTextBox">
                <el-input class="infoText" v-model="layerService.downloadUrl"/>
              </el-form>
            </el-col>
            <el-col :span="6">
              <el-form class="infoButtonBox">
                <el-button class="infoButton" @click="downloadService(layerService.downloadUrl)">download
                </el-button>
              </el-form>
            </el-col>
          </div>
          <div style="height: 50px; width: 100%">
            <el-col :span="4">
              <div class="infoTitle">getcapabilities:</div>
            </el-col>
            <el-col :span="14">
              <el-form class="infoTextBox">
                <el-input class="infoText" v-model="layerService.getCapabilitiesUrl"/>
              </el-form>
            </el-col>
            <el-col :span="6">
              <el-form class="infoButtonBox">
                <el-button class="infoButton" @click="getServiceCapabilities(layerService.getCapabilitiesUrl)">
                  getCapabilities
                </el-button>
              </el-form>
            </el-col>
          </div>
        </div>
        <div id="layer-switch">
          <el-tooltip class="item" effect="dark" content="图层管理器" placement="left">
            <img src="../../../../static/img/layer-control.png" alt="图层管理" @click="changeLayerTreeShow"/>
          </el-tooltip>
        </div>
        <div id="layerTree-container" v-show="isLayerTreeShow">
          <LayerTree :data="baseTreeItems" @selectChange="selectBaseChange" :isCheckAll="all"/>
          <LayerTree :data="mapTreeItems" @selectChange="selectMapChange" :isCheckAll="empty"/>
          <button id="removeChosenMaps" style="{color: white;  width: 100%; font-size: 14px; padding-top: 5px;}"
                  @click="removeChosenMaps">
            移除所选图层
          </button>
        </div>
        <button id="context" :style="{left: tranLeft, top: tranTop}" v-if="isContextShow" @click="getServiceByLocation">
          获取服务
        </button>
      </div>
    </el-col>

    <el-col :span="4" :style="{ height: myHeight + 'px' }" class="wrap-right">
      <div class="wrap-fileList" :style="{ height: myHeight + 'px' }">
        <el-input placeholder="搜索图层" v-model="filterFileText" style="margin-top: 5px"
                  class="fileFilterInput"></el-input>
        <el-col class="fileListTreeDiv" :style="{ height: myHeight - 50 + 'px', width: '100%' }">
          <el-tree
            class="fileListTree"
            v-if="fileTreeList"
            :data="fileTreeList"
            :props="defaultProps"
            @node-click="fileNameClick"
            :filter-node-method="filterFile"
            ref="fileTree"
          ></el-tree>
        </el-col>
      </div>
    </el-col>
  </el-row>

</template>

<script>
import "ol/ol.css";
import {Map, View} from "ol";
import {Tile as TileLayer} from "ol/layer";
import {TileArcGISRest, XYZ} from "ol/source";
import LayerTree from "./LayerTree";
import axios from "axios";
import TileWMS from "ol/source/TileWMS"
import {Notification} from 'element-ui';

export default {
  name: "BaseMap",
  data() {
    return {
      filterFileText: "",
      selectNodeTreeList: [],
      myHeight: window.innerHeight - 50,
      myWidth: window.innerWidth,
      fileTreeList: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      loading: false,
      serviceName: "",
      layerName: "",
      clickCoordinate: null,
      tranLeft: 0,
      tranTop: 0,
      isContextShow: false,
      isLayerTreeShow: false,
      isServiceinfoShow: false,
      baseLayers: [],
      mapLayers: [],
      empty: [],
      baseTreeItems: [],
      mapTreeItems: [],
      tianDiTuKey: "60f62b68fd6bbe652ae59aeec34c78f0",
      tianDiTuData: [
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
      index: 0,
      all: ["allLayers"],
      selectSingleClick: null,
      layerService: {},
    };
  },
  components: {LayerTree},
  watch: {
    filterFileText: function () {
      this.$refs.fileTree.filter(this.filterFileText);
    }
  },
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
      for (let i = 0; i < this.tianDiTuData.length; i++) {
        let layer = this.tianDiTuData[i];
        let tileLayer;
        let name = layer.name;
        let url = layer.url;
        tileLayer = new TileLayer({
          title: name,
          source: new XYZ({
            crossOrigin: "anonymous",
            url: url + "&tk=" + this.tianDiTuKey
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
          label: "基础底图",
          children: children
        }
      ];
    },
    initFileTree() {
      axios({
        method: "get",
        url: "../../../../static/json/serviceFileTree.json"
      })
        .then(res => {
          this.fileTreeList = res.data;
        })
        .catch(error => {
          console.log(error);
        });
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
              let layerName = layer.layerName;
              let url = layer.serviceUrl;
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
                  title: layerName,
                  center: center,
                  source: new TileWMS({
                    url: url,
                    params: {LAYERS: layerName, TILED: true},
                    serverType: "geoserver",
                  }),
                  visible: false,
                  className: className
                });
              }
              if (serverType === "arcgisrest") {
                let url = layer.serviceUrl;
                tileLayer = new TileLayer({
                  title: layerName,
                  center: center,
                  source: new TileArcGISRest({
                    crossOrigin: "anonymous",
                    url: url
                  }),
                  visible: false
                });
              }
              if (tileLayer) {
                let key = i.toString();
                this.index = (i + this.tianDiTuData.length)
                tileLayer.setZIndex(this.index);
                this.mapLayers[key] = tileLayer;
                this.map.addLayer(tileLayer);
                tileLayer.setVisible(false);
                let treeItem = {
                  layerId: key,
                  label: layerName
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
            Notification({
              title: "通知",
              message: "坐标" + "\n" + clickCoordinate + "\n" + "查询成功"
            })
          }
        })
        .catch(error => {
          console.log(error);
          Notification({
            title: "通知",
            message: "坐标" + "\n" + clickCoordinate + "\n" + "查询失败："+"\n" + error
          })
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

      this.isContextShow = false;
      this.updateMapVisibility("allLayers", false);
      this.mapTreeItems = [];
      this.getMapByLocation(this.clickCoordinate);
    },
    addMousePositionClick() {
      let that = this;
      this.map.on('singleclick', function (e) {
        that.clickCoordinate = e.coordinate;
        that.tranLeft = (e.pixel[0] + 20) + 'px';
        that.tranTop = (e.pixel[1] + 50) + 'px';
        // 点击的时候显示或隐藏菜单
        that.isContextShow = !that.isContextShow;
        if (that.isServiceinfoShow) {
          that.isServiceinfoShow = false;
        }
      })
    },
    filterFile(value, data) {
      if (!value) return true;
      return data.label.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    fileNameClick(val) {
      if (this.$refs.fileTree.currentNode.node.data.children == null) {
        this.selectNodeTreeList = [];
        let currentParentNode = this.$refs.fileTree.currentNode.node;
        let currentlayerId = this.$refs.fileTree.currentNode.node.data.id;
        this.selectNodeTreeList.unshift(currentParentNode.data.label);
        currentParentNode = currentParentNode.parent;
        let serviceType = null;
        while (currentParentNode.parent != null) {
          serviceType = currentParentNode.data.label;
          this.selectNodeTreeList.unshift(serviceType);
          currentParentNode = currentParentNode.parent;
        }
        this.layerName = this.selectNodeTreeList[
        this.selectNodeTreeList.length - 1
          ];
        // alert(this.selectNodeTreeList[0] + ">>" + this.selectNodeTreeList[1] + ">>" + this.selectNodeTreeList[2]);
        this.getDataServicesByServiceId(currentlayerId);
      }
    },
    getDataServicesByServiceId(layerId) {
      axios({
        method: "get",
        url: "api/service/dataservice/uuid/" + layerId
      })
        .then(res => {
          if (res.data.data) {
            this.layerService = res.data.data;
            this.isServiceinfoShow = true;
          }
        }).catch(error => {
        console.log(error);
      });
    },
    removeChosenMaps() {
      let children = [];
      for (let rindex = this.mapLayers.length - 1; rindex >= 0; rindex--) {
        if (this.mapLayers[rindex].getVisible()) {
          this.mapLayers[rindex].setVisible(false);
          this.mapLayers.splice(rindex, 1);
          this.map.removeLayer(this.mapLayers[rindex]);
        }
      }
      for (let i = 0; i < this.mapLayers.length; i++) {
        let layer = this.mapLayers[i];
        let treeItem = {
          layerId: i,
          label: layer.values_.title
        };
        children.push(treeItem);
      }
      this.mapTreeItems[0].children = children;
      if (this.mapTreeItems[0].children.length === 0) {
        this.mapTreeItems = [];
      }
    },
    addMapLayer(layerService) {
      let tileLayer;
      if (layerService.serverType === "geoserver") {
        tileLayer = new TileLayer({
          title: layerService.layerName,
          center: layerService.center,
          source: new TileWMS({
            url: layerService.serviceUrl,
            params: {LAYERS: layerService.layerName, TILED: true},
            serverType: "geoserver",
          }),
          visible: false,
          className: layerService.serviceType
        });
      }
      if (layerService.serverType === "arcgisrest") {
        tileLayer = new TileLayer({
          title: layerService.layerName,
          center: layerService.center,
          source: new TileArcGISRest({
            crossOrigin: "anonymous",
            url: layerService.serviceUrl
          }),
          visible: false
        });
      }
      if (tileLayer) {
        let key = this.mapLayers.length;
        if (this.index === 0) {
          this.index = this.tianDiTuData.length;
        } else {
          this.index = this.index + 1;
        }
        tileLayer.setZIndex(this.index);
        this.mapLayers[key] = tileLayer;
        this.map.addLayer(tileLayer);
        tileLayer.setVisible(false);
        let treeItem = {
          layerId: key,
          label: layerService.layerName
        };
        if (this.mapTreeItems.length == 0) {
          let children = [];
          children.push(treeItem);
          this.mapTreeItems = [
            {
              layerId: "allLayers",
              label: "加载图层",
              children: children
            }
          ];
        } else {
          this.mapTreeItems[0].children.push(treeItem);
        }
      }
    },
    downloadService(url) {
      window.open(url, '_blank')
    },
    getServiceCapabilities(url) {
      window.open(url, '_blank')
    },
  },
  mounted: function () {
    this.initBase();
    this.initFileTree();
    this.addMousePositionClick();
  }
};
</script>

<style scoped lang="stylus">

.wrap {
  margin: 0;
  overflow: hidden;
  bottom: 0;
  right: 0;
  width: 100%;
  padding: 50px 0 0 0;
  background-color: #ffffff;
}

.wrap-left {
  background-color: #ffffff;
}

.wrap-right {
  background-color: #ffffff;
  border: 2px solid #304156;
}

#mapDiv {
  width: 100%;
  height: 100%;
  overflow: auto;
}

#service-info {
  width: 800px;
  height: 370px;
  background-color: #fff;
  border: 2px solid #304156;
  padding: 10px 10px 10px 10px;
  position: absolute;
  left: 40%;
  top: 50%;
  margin-left: -400px;
  margin-top: -200px;
  z-index: 9
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

.wrap-fileList {
  height: 100% !important;
}

.infoTitle {
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  color: black;
  text-align: left;
}

infoTextBox {
  width: 100%;
  height: 50px;
}

.infoButtonBox {
  width: 100%;
  height: 40px;
  margin-top: 5px;
  margin-bottom: 5px;
  left 0;
}

.infoText {
  margin-top: 5px;
  margin-bottom: 5px;
}

.el-button {
  width: 160px;
  float: right;
  background #c8ddff;
  border: 2px solid #000000;
}


.fileListTreeDiv {
  overflow: auto;
  margin-top: 5px;
  background-color: #fff;
}

.fileListTreeDiv {
  overflow: auto;
  margin-top: 5px;
  background-color: #fff;
}

.fileListTreeDiv::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 6px;
}

.fileListTreeDiv::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px #787878;
  background: #787878;
}

.fileListTreeDiv::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(217, 217, 217, 0.8);
  border-radius: 0;
  background: rgba(217, 217, 217, 0.8);
}

.el-input__inner {
  border-radius: 0px;
  border: 2px
}

.fileListTree {
  border-radius: 3px;
}

.fileListTree >>> .el-tree-node__content > .el-tree-node__expand-icon::before {
  color: transparent;
  background: #fff url("../../../../static/img/folderBefore.png");
  background-size: cover;
}

.fileListTree >>> .el-tree-node__content > .el-tree-node__expand-icon.expanded::before {
  color: transparent;
  background: #fff url("../../../../static/img/folderAfter.png");
  background-size: cover;
}

.fileListTree >>> .el-tree-node__content > .el-tree-node__expand-icon.is-leaf::before {
  color: transparent;
  background: #fff url("../../../../static/img/document.png");
  background-size: cover;
  background-size: 15px 15px;
}
</style>
