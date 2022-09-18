<template>
  <div class="container">
    <div class="section0">
      <el-row>
        <el-col :span="5" style="margin-bottom: 0px">
          <div style="color: rgba(0,0,0,0.95)"><span style="font-size: x-large"> <strong>我的资源</strong></span></div>
        </el-col>
        <el-col style="margin-bottom: 0px">
          <el-divider></el-divider>
        </el-col>
        <el-col>
          <el-form :inline="true" :model="searchForm">
            <el-form-item>
              <el-date-picker v-model="searchForm.time" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-select v-model="searchForm.type" placeholder="下拉选择" @change="setDataType" id="select-type" multiple
                         collapse-tags>
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchForm.text" placeholder="请输入查询条件"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col>
          <div style="float: right;margin-bottom: 10px">
            <el-button type="primary" size="small">新增</el-button>
            <el-button type="primary" size="small">批量删除</el-button>
            <el-button type="primary" size="small">取消选择</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="section1">
      <div class="table-container">
        <el-table :data="tableData" style="width: 100%;" :cell-style="{padding: '5'}" :height="450">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="name" label="名称" width="200"></el-table-column>
          <el-table-column prop="type" label="类型" width="120"></el-table-column>
          <el-table-column prop="date" label="创建时间" width="180"></el-table-column>
          <el-table-column prop="desr" label="描述" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleDetail(scope.$index, scope.row)" style="color: #7299db">
                查看
              </el-button>
              <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)" style="color: #7299db">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="section2">
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50]"
        :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        background id="pagination">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyResource",
  data() {
    return {
      searchForm: {
        time: '',
        type: '',
        text: ''
      },
      activeNames: ["1"],
      tableData: [
        {
          id: 'u1',
          name: '资源1',
          type: 'WMS',
          desr: '这是一个关于武汉市的WMS服务，坐标为XXXXXXXX，包含方法XXXXXXXXXXXXXXXXXXXXXXXX',
          date: '2021-11-20'
        }, {
          id: 'u2',
          name: '资源2',
          type: 'WFS',
          desr: '这是一个关于武汉市的WFS服务，坐标为XXXXXXXX，包含方法XXXXXXXXXXXXXXXXXXXXXXXX',
          date: '2021-11-20'
        },
        {
          id: 'u2',
          name: '资源2',
          type: 'WFS',
          desr: '这是一个关于武汉市的WFS服务，坐标为XXXXXXXX，包含方法XXXXXXXXXXXXXXXXXXXXXXXX',
          date: '2021-11-20'
        }, {
          id: 'u2',
          name: '资源2',
          type: 'WFS',
          desr: '这是一个关于武汉市的WFS服务，坐标为XXXXXXXX，包含方法XXXXXXXXXXXXXXXXXXXXXXXX',
          date: '2021-11-20'
        }, {
          id: 'u2',
          name: '资源2',
          type: 'WFS',
          desr: '这是一个关于武汉市的WFS服务，坐标为XXXXXXXX，包含方法XXXXXXXXXXXXXXXXXXXXXXXX',
          date: '2021-11-20'
        },
        {
          id: 'p2',
          name: '资源1',
          type: 'WPS',
          desr: '这是一个关于武汉市的WPS服务，坐标为XXXXXXXX，包含方法XXXXXXXXXXXXXXXXXXXXXXXX',
          date: '2021-11-20'
        },
        {
          id: 'w1',
          name: '工作流',
          type: 'Workflow',
          desr: '这是一个工作流，坐标为XXXXXXXX，包含方法XXXXXXXXXXXXXXXXXXXXXXXX',
          date: '2021-11-20'
        }, {
          id: 'o1',
          name: '武汉市Landsat',
          type: 'tiff',
          desr: '这是一个武汉市Landsat图像，坐标为XXXXXXXX，包含方法XXXXXXXXXXXXXXXXXXXXXXXX',
          date: '2021-11-20'
        },
        {
          id: 'o2',
          name: '武汉市边界',
          type: 'geojson',
          desr: '这是一个武汉市边界shapefile，坐标为XXXXXXXX，包含方法XXXXXXXXXXXXXXXXXXXXXXXX',
          date: '2021-11-20'
        }
      ],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      resourceType: "All",
      options: [
        {
          value: 'All',
          label: 'All'
        },
        {
          value: 'WFS',
          label: 'WFS'
        },
        {
          value: 'WMS',
          label: 'WMS'
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
          value: 'REST',
          label: 'REST'
        }, {
          value: 'Others',
          label: 'Others'
        }],
    }
  },

  methods: {
    handleDelete(index, rows) {
      this.$confirm('此操作将删除该资源，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        this.tableData.splice(index, 1)
      })
    },
    handleDetail(index, rows) {

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
    height 20%
    margin 20px
  }

  .section1 {
    height 65%
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
