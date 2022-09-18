<template>
  <div id="knowledgeGraph">
    <div id="graphWindow"></div>
    <div id="graphInfo">节点关系提示区</div>
  </div>
</template>

<script>
  var that = null;
  export default {
    name: "KnowledgeGraph",
    data() {
      return {
        mapHeight: (window.innerHeight - 80) + 'px',
        mapWidth: (window.innerWidth) + 'px',
        symbolSize: 40,
        fontSize: 12,
        chartTitle: "服务簇网络",
        option: {},
        graph: null,
        series: [],
        graphData: {},
        nodes: [],
        links: [],
        categories: [],
        graphJson: '../../../static/json/data.json'
      }
    },

    mounted() {
      this.initChartData();
      window.addEventListener('resize', this.resizeHandle)
    },

    destroyed() {
      window.removeEventListener('resize', this.resizeHandle)
    },

    methods: {
      initChartData() {
        that = this;
        // 基于准备好的dom，初始化echarts实例
        this.graph = this.$echarts.init(document.getElementById('graphWindow'));
        this.graph.showLoading();
        this.$http.get('http://localhost:8888/knowledgegraph/abstractservice/200').then((response) => {
          that.graphData = response.data.data;
          if (that.graphData.nodes.length <= 100) {
            that.symbolSize = 40;
            that.fontSize = 12
          }
          if (that.graphData.nodes.length > 100 && that.graphData.nodes.length <= 1000) {
            that.symbolSize = 20;
            that.fontSize = 10
          }
          if (that.graphData.nodes.length > 1000 && that.graphData.nodes.length <= 10000) {
            that.symbolSize = 10;
            that.fontSize = 8
          }
          if (that.graphData.nodes.length > 10000) {
            that.symbolSize = 5;
            that.fontSize = 6
          }
          that.initData();
          that.drawChart()
        }).catch(function (error) {
          console.log(error)
        });
      },

      initData() {
        let this_ = this;
        this.option = {
          title: {
            text: this_.chartTitle,
            show: true
          },
          color: ['#B22222', '#CD853F', '#4169E1', '#008000', '#000000', '#CCFF33', '#33FF33', '#33FFAA', '#33CCFF', '#5599FF', '#5555FF', '#7744FF', '#B94FFF', '#CC00FF', '#990099'],
          legend: {
            data: this_.graphData.categories
          },
          series: [{
            type: 'graph',//类型为关系图
            layout: 'force', //图的布局，类型为力导图，'circular' 采用环形布局，见示例 Les Miserables
            roam: true,// 如果为False 则禁用放大和缩小功能，true为打开
            data: this_.graphData.nodes,
            symbolSize: this_.symbolSize,
            categories: this_.graphData.categories,
            draggable: true,
            legendHoverLink: true,//是否启用图例 hover(悬停) 时的联动高亮。
            hoverAnimation: true,//是否开启鼠标悬停节点的显示动画
            focusNodeAdjacency: true,//是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
            force: { //力引导图基本配置
              repulsion: 100,//节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
              gravity: 0.03,//节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
              edgeLength: [20, 180],//边的两个节点之间的距离，这个距离也会受 repulsion。值越小则长度越长
              layoutAnimation: true//因为力引导布局会在多次迭代后才会稳定，这个参数决定是否显示布局的迭代动画，在浏览器端节点数据较多（>100）的时候不建议关闭，布局过程会造成浏览器假死。
            },
            itemStyle: {//===============图形样式，有 normal 和 emphasis 两个状态。normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
              normal: { //默认样式
                borderType: 'solid', //图形描边类型，默认为实线，支持 'solid'（实线）, 'dashed'(虚线), 'dotted'（点线）。
                borderWidth: 0, //图形的描边线宽。为 0 时无描边。
                opacity: 1// 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。默认0.5

              },
              emphasis: {//高亮状态

              }
            },
            lineStyle: { //==========关系边的公用线条样式。
              normal: {
                color: 'source',
                width: '0.5',
                type: 'solid', //线的类型 'solid'（实线）'dashed'（虚线）'dotted'（点线）
                curveness: 0.1, //线条的曲线程度，从0到1
                opacity: 1// 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。默认0.5
              },
              emphasis: {//高亮状态

              }
            },
            label: { //=============图形上的文本标签
              normal: {
                show: true,//是否显示标签。
                position: 'right',//标签的位置。['50%', '50%'] [x,y]
                textStyle: { //标签的字体样式
                  color: '#000000', //字体颜色
                  fontStyle: 'normal',//文字字体的风格 'normal'标准 'italic'斜体 'oblique' 倾斜
                  fontWeight: 'bolder',//'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的或100 | 200 | 300 | 400...
                  fontFamily: 'sans-serif', //文字的字体系列
                  fontSize: this_.fontSize, //字体大小
                }
              },
              emphasis: {//高亮状态
                show: true,//是否显示标签。
                position: 'right',//标签的位置。['50%', '50%'] [x,y]
                textStyle: { //标签的字体样式
                  color: '#000000', //字体颜色
                  fontStyle: 'normal',//文字字体的风格 'normal'标准 'italic'斜体 'oblique' 倾斜
                  fontWeight: 'bolder',//'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的或100 | 200 | 300 | 400...
                  fontFamily: 'sans-serif', //文字的字体系列
                  fontSize: this_.fontSize //字体大小
                }
              }
            },
            tooltip: {
              trigger: 'item',
              triggerOn: 'mousemove',
              enterable: true,//鼠标是否可进入提示框浮层中
              formatter: function (params) {
                console.log(params);
              },//修改鼠标悬停显示的内容
            },
            edgeLabel: {//==============线条的边缘标签
              normal: {
                show: false,//是否显示标签。
                position: 'middle',//标签的位置。['50%', '50%'] [x,y]
                formatter: function (x) {
                  return x.data.name;
                },
                textStyle: { //标签的字体样式
                  color: '#000000', //字体颜色
                  fontStyle: 'normal',//文字字体的风格 'normal'标准 'italic'斜体 'oblique' 倾斜
                  fontWeight: 'bolder',//'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的或100 | 200 | 300 | 400...
                  fontFamily: 'sans-serif', //文字的字体系列
                  fontSize: this_.fontSize, //字体大小
                }
              },
              emphasis: {//高亮状态
                show: true,//是否显示标签。
                position: 'middle',//标签的位置。['50%', '50%'] [x,y]
                formatter: function (x) {
                  return x.data.name;
                },
                textStyle: { //标签的字体样式
                  color: '#000000', //字体颜色
                  fontStyle: 'normal',//文字字体的风格 'normal'标准 'italic'斜体 'oblique' 倾斜
                  fontWeight: 'bolder',//'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的或100 | 200 | 300 | 400...
                  fontFamily: 'sans-serif', //文字的字体系列
                  fontSize: this_.fontSize, //字体大小
                }
              }
            },
            edges: this_.graphData.links,
            edgeSymbol: ['none', 'arrow']//边两端的标记类型，可以是一个数组分别指定两端，也可以是单个统一指定。默认不显示标记，常见的可以设置为箭头，如下：edgeSymbol: ['circle', 'arrow']
          }]
        }
      },

      drawChart() {
        // 绘制图表
        if (this.option && typeof this.option === 'object') {
          this.graph.hideLoading();
          this.graph.setOption(this.option, true)
        }
        that = this;
        this.graph.on('click', function (params) {
          function appendPath(params) {
            if (params.dataType === "node") { //dataType可以是edge(线条)或node(数据)
              if (params.data.category === "WPSCluster") {
                that.graph.showLoading();
                that.$http.get('../../../../static/data1.json').then((response) => {
                  that.graphData = response.data;
                  that.graph.hideLoading();
                  that.chartTitle = params.data.name;
                  that.initData();
                  that.graph.setOption(that.option, true)
                }).catch(function (error) {
                  console.log(error)
                });
              }
              return params.data.abstract;
            } else if (params.dataType === "edge") { //当鼠标停留在连线上时，暂不处理
              if (params.data.name === "输入") {
                return "服务：" + params.data.source + " 可输入 服务：" + params.data.target;
              }
              if (params.data.name === "下一步") {
                return "服务：" + params.data.target + " 可作为 服务：" + params.data.source + "的下一步"
              }
            }
          }

          // window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(params.name));
          let str = appendPath(params);
          document.getElementById("graphInfo").innerHTML = str;
          return str;
        });
      },

      resizeHandle() {
        if (this.resizeTimer) {
          clearTimeout(this.resizeTimer)
        }
        this.resizeTimer = setTimeout(function () {
          let echartsWarp = document.getElementById('graphWindow');
          echartsWarp.style.width = (window.innerWidth) + 'px';
          echartsWarp.style.height = (window.innerHeight - 70) + 'px';
          echartsWarp.style.left = 0;
          echartsWarp.style.right = 0;
          echartsWarp.style.bottom = 70 + 'px';
          if (that.option && typeof that.option === 'object') {
            that.graph.setOption(that.option, true)
          }
          that.graph.resize()
        }, 300)
      }
    }
  }
</script>

<style scoped lang="stylus">
  #knowledgeGraph
    position absolute
    top 70px
    left 0
    right 0
    bottom 0

  #graphWindow {
    position: absolute;
    bottom: 50px;
    margin-left auto
    margin-right auto
    left 0
    right 0
    width 90%
    top 0
  }

  #graphInfo {
    position: absolute;
    bottom: 50px;
    margin-left auto
    margin-right auto
    left 0
    right 0
    width 90%
  }
</style>
