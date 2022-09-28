<template>
  <div class="containers">
    <el-card class="box-card" shadow="never">
      <div>
        <div style="font-size:25px;margin-bottom: 20px">WS4GEE Process Client</div>
        <div style="font-size: 10px; color: gray">This is a Web-based UI to test GEE-enabled WPS.</div>
      </div>
      <el-divider></el-divider>

      <div>
        <b>Service URL:</b>
        <el-input v-model="serviceURL" placeholder="Default: All" style="width: 60%" size="mini"></el-input>
      </div>
      <div>
        <b>Request Examples:</b>
        <el-select v-model="xmlFile"
                   filterable
                   allow-create
                   default-first-option
                   placeholder="Please select an XML example" style="width: 30%" size="mini" @change="onXMLSelected">
          <el-option v-for="item in xmlList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value" size="mini"></el-option>
        </el-select>
      </div>
      <div>
        <el-input
          type="textarea" style="width: 70%"
          :rows="20" resize="none"
          placeholder="<!-- Insert your request here or select one of the examples from the menu above. -->​"
          v-model="xmlContent">
        </el-input>
      </div>
      <div>
        <el-button @click="sendRequest()" size="mini">Send</el-button>
        <el-button @click="clearRequest()" size="mini">Clear</el-button>
        <el-button @click="resultDialog=true" size="mini">Ckeck Result</el-button>
      </div>
    </el-card>
    <el-dialog title="Results" :visible.sync="resultDialog" >
      <el-input
        type="textarea"
        :rows="20" resize="none"
        v-model="xmlResult"
        v-loading="loading">
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resultDialog = false">OK</el-button>
        <el-button @click="resultDialog = false">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vkbeautify from 'vkbeautify'

export default {
  name: "ProcessClient",
  data() {
    return {
      serviceURL: "http://43.154.247.161:8000/ws4gee/wps",
      xmlFile: "",
      xmlList: [
        {
          value: 'id1',
          label: 'ws4gee.FVC.xml'
        }
      ],
      xmlContent: "",
      resultDialog:false,
      xmlResult:"111",
      loading:true
    }
  },
  mounted(){
    this.setXmlList()
  },
  methods: {
    setXmlList(){
      this.$http({
        method: 'get',
        url: 'api/ws4gee/xml/list',
      }).then(response => {
        let result=JSON.parse(response.data.replaceAll("\'","\""))
        let code=result.code
        if (code===0){
          let fileNames=result.data
          this.xmlList=[]
          for (let index in fileNames){
            this.xmlList.push({value: fileNames[index],label: fileNames[index]})
          }
        }
      })
    },
    onXMLSelected(value) {
      this.$http({
        method: 'get',
        url: 'api/ws4gee/xml/context',
        params: {
          curId: value
        },
      }).then(response => {
        this.xmlContent = vkbeautify.xml(response.data)
      })
    },
    sendRequest(value){
      this.xmlResult=""
      this.loading=true
      this.resultDialog=true
      this.$http({
        method: 'post',
        url: 'api/ws4gee/wps',
        data: {
          xml: this.xmlContent
        },

      }).then(response => {
        this.loading=false
        this.xmlResult = vkbeautify.xml(response.data)
      })
    },
    clearRequest(){
      this.xmlContent=""
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

.box-card {
  div {
    margin-bottom: 10px
  }
}
</style>
