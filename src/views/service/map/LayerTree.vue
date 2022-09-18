<template>
  <div class="layercontrol">
    <el-tree
      :data="data"
      show-checkbox
      node-key="layerId"
      default-expand-all
      :default-checked-keys="isCheckAll"
      :expand-on-click-node="false"
      :render-content="renderContent"
      @check="selectChange"
      :addLayers="addLayers"
      ref="tree"
    >
    </el-tree>
  </div>
</template>
<script>
export default {
  name: "LayerTree",
  props: {
    data: {
      type: Array,
      required: true
    },
    isCheckAll: {
      type: Array,
      required: true
    },
    addLayers: {
      type: Array,
      default: () => [],
      required: false
    }
  },
  watch: {
    addLayers: {
      immediate: true,
      deep: true,
      handler: function() {
        if (this) {
          if (this.addLayers && this.addLayers.length !== 0) {
            this.setCheckedNodes(this.addLayers);
          }
        }
      }
    }
  },
  created() {},
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span>
          {" "}
          <span> {node.label}</span>{" "}
        </span>
      );
    },
    selectChange(data) {
      this.$emit("selectChange", data.layerId);
    },
    setCheckedNodes(data) {
      this.$refs.tree.setCheckedNodes(data);
      this.$emit("layerChange", data[0].layerId);
    },
    getCheckedKeys() {
      // console.log(this.$refs.tree.getCheckedKeys());
    },
    setCheckedKeys(data) {
      this.$refs.tree.setCheckedKeys(data);
    }
  }
};
</script>

<style scoped>
.layercontrol {
  background-color: white;
  width: 100%;
  font-size: 14px;
  padding-top: 5px;
}
</style>
